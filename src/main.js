import {
    select,
} from './general/utils/dom';

import {App} from './system/application';
import {Service} from './service/01/';
import {log} from './general/utils/dev';

import alert from './web/components/swal';

import {enableFullScreenMask} from './system/modules/screen';

function startLoading(scene) {
    const comp = select('#app');
    const svg = select('#preload');
    svg.remove();

    comp.prepend(app.view);

    const loadScene = scene.create();
    app.stage.addChild(loadScene);
    app.resize();

    return loadScene;
}

async function main() {
    //  Init App
    try {
        document.title = '來!貓下去';

        global.app = new App(Service);

        enableFullScreenMask();

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

        const ui = UserInterface.create();
        const scene = MainScene.create(initData);
        scene.addChild(ui);

        app.stage.addChildAt(scene, 0);

        app.once('GameReady', () => {
            app.stage.removeChild(loadScene);
            app.resize();
            app.emit('Idle');
        });
    } catch (err) {
        console.error(err);
        alert.error({title: err.message});
    }
}

main();
