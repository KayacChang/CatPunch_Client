import {
    select, remove, log,
} from './general';

import {App} from './system/application';
import {Service} from './service/01/';

import i18n from './plugin/i18n';
import ENV_URL from './env.json';

import {enableFullScreenMask} from './system/modules/screen';

const isProduction = process.env.NODE_ENV === 'production';

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

        const [res, translate] =
            await Promise.all([fetchJSON(ENV_URL), i18n.init()]);

        global.ENV = {
            SERVICE_URL:
            // res['prodServerURL'],
                isProduction ? res['prodServerURL'] : res['devServerURL'],

            LOGIN_TYPE: res['loginType'],
            GAME_ID: res['gameID'],
        };

        global.translate = translate;

        global.app = new App(Service);

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
    } catch (err) {
        console.error(err);

        const msg = {title: err.message};

        app.alert.error(msg);
    }
}

main();
