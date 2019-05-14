import {
    select,
    clear,
} from './web/utils/dom';

import {App} from './system/application';
// import {Service} from './service/01/';
import {log} from './general/utils/dev';

function startLoading(scene) {
    const comp = select('#app');
    clear(comp);
    comp.appendChild(app.view);

    scene.create();
    app.resize();
}

function loadComplete(scene) {
    app.stage.removeChildren();

    scene.create();
    app.resize();
}

async function main() {
    //  Init App
    // global.app = new App(Service);
    global.app = new App();

    // Import Load Scene
    const loadScene = await import('./game/scenes/load/scene');

    await app.resource.load(loadScene);

    startLoading(loadScene);

    //  Import Main Scene
    // const mainScene = await import('./game/scenes/main');
    const userInterface = await import('./game/interface/slot');

    app.on('loading', ({progress}, {name}) =>
        log(
            `Progress: ${progress} % \n` +
            `Resource: ${name}`,
        ));

    await Promise.all([
        // app.service.sendLogin(),
        // app.resource.load(mainScene),
        app.resource.load(userInterface),
    ]);

    loadComplete(userInterface);
}

main();
