import {
    select,
} from './general/utils/dom';

import {App} from './system/application';
import {Service} from './service/00/';
import {log} from './general/utils/dev';

import alert from './web/components/swal';

import {isMobile} from 'pixi.js/lib/core/utils';
import {enableFullScreenMask} from './system/modules/screen';

function startLoading(scene) {
    const comp = select('#app');
    const svg = select('#preload');
    svg.remove();

    comp.prepend(app.view);

    const loadScene = scene.create();
    app.stage.addChild(loadScene);
    app.resize();

    if (isMobile.phone) enableFullScreenMask();

    return loadScene;
}

async function main() {
    //  Init App
    try {
        global.app = new App(Service);

        await app.service.login();

        const initData = await app.service.init();

        // Import Load Scene
        const LoadScene = await import('./game/scenes/load/scene');

        await app.resource.load(LoadScene);

        const loadScene = startLoading(LoadScene);

        //  Import Main Scene
        const MainScene = await import('./game/scenes/main');
        const UserInterface = await import('./game/interface/slot');

        app.on('loading', ({progress}, {name}) => {
            log(`Progress: ${progress} %`);
            log(`Resource: ${name}`);

            loadScene.update(progress);
        });

        await Promise.all([
            app.resource.load(MainScene, UserInterface),
        ]);

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
