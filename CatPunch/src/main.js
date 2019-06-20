import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
    select, remove, log, isProduction, err,
} from './general';

import {App} from './system/application';
import {Service} from './service/01/';

import i18n from './plugin/i18n';
import ENV_URL from './env.json';

import {enableFullScreenMask} from './system/modules/screen';

function startLoading(scene) {
    const comp = select('#app');
    const svg = select('#preload');
    svg.remove();

    comp.prepend(app.view);

    const loadScene = scene.create();
    app.stage.addChild(loadScene);
    app.resize();

    enableFullScreenMask();

    return loadScene;
}

function fetchJSON(url) {
    return fetch(url).then((res) => res.json());
}


async function main() {
    //  Init App
    try {
        document.title = 'For Every Gamer | 61 Studio';

        const res = await fetchJSON(ENV_URL);

        global.ENV = {
            SERVICE_URL:
                isProduction() ? res['prodServerURL'] : res['devServerURL'],

            LOGIN_TYPE: res['loginType'],
            GAME_ID: res['gameID'],
            I18N_URL: res['i18nURL'],
        };

        global.translate = await i18n.init();

        global.app = new App();

        app.service = new Service();

        // Import Load Scene
        const LoadScene = await import('./game/scenes/load/scene');

        await app.resource.load(LoadScene);

        const loadScene = startLoading(LoadScene);

        app.on('loading', ({progress}, {name}) => {
            log(`Progress: ${progress} %`);
            log(`Resource: ${name}`);

            loadScene.update(progress);
        });

        await app.service.login();

        //  Import Main Scene
        const [MainScene, UserInterface, initData] =
            await Promise.all([
                import('./game/scenes/main'),
                import('./game/interface/slot'),
                app.service.init(),
            ]);

        await app.resource.load(MainScene, UserInterface);

        const ui = UserInterface.create(initData);
        const scene = MainScene.create(initData);
        scene.addChild(ui);

        app.stage.addChildAt(scene, 0);

        app.once('GameReady', () => {
            app.stage.removeChild(loadScene);

            select('script').forEach(remove);

            app.resize();

            document.title = translate('title');

            app.emit('Idle');
        });
    } catch (error) {
        err(error);

        const msg = {title: error.message};

        app.alert.error(msg);
    }
}

main();
