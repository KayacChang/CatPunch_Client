import {
    select,
    clear,
} from './web/utils/dom';

import {App} from './system/application';
import {Service} from './service/00/';
import {log} from './general/utils/dev';

function startLoading(scene) {
    const comp = select('#app');
    clear(comp);
    comp.appendChild(app.view);

    const loadScene = scene.create();
    app.stage.addChild(loadScene);
    app.resize();

    return loadScene;
}

async function main() {
    //  Init App
    // global.app = new App(Service);
    global.app = new App(Service);

    const result = await app.service.login();
    console.log(result);

    const user = await app.service.getUser();
    console.log(user);

    const initData = await app.service.init();
    console.log(initData);

    // Import Load Scene
    const LoadScene = await import('./game/scenes/load/scene');

    await app.resource.load(LoadScene);

    const loadScene = startLoading(LoadScene);

    //  Import Main Scene
    const MainScene = await import('./game/scenes/main');
    const UserInterface = await import('./game/interface/slot');

    app.on('loading', ({progress}, {name}) =>
        log(
            `Progress: ${progress} % \n` +
            `Resource: ${name}`,
        ));

    await Promise.all([
        // app.service.sendLogin(),
        app.resource.load(MainScene, UserInterface),
    ]);


    const ui = UserInterface.create();
    const scene = MainScene.create(initData);
    scene.addChild(ui);

    app.stage.addChildAt(scene, 0);

    app.once('GameReady', () => {
        app.stage.removeChild(loadScene);
        app.resize();
    });
}

main();
