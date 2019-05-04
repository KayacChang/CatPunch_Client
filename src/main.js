import {
    select,
    clear,
} from './utils/web/dom';

import {App} from './system/application';
// import {Service} from './service/01/';
import {log} from './utils/dev';

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
    try {
        //  Init App
        // global.app = new App(Service);
        global.app = new App();

        // Import Load Scene
        const loadScene = await import('./game/scenes/load/scene');

        await app.resource.load(loadScene);

        startLoading(loadScene);

        //  Import Main Scene
        const mainScene = await import('./game/scenes/main/scene');

        app.on('loading', ({progress}, {name}) => {
            const msg =
                `Progress: ${progress} % \n` +
                `Resource: ${name}`;
            log(msg);
        });

        await Promise.all([
            // app.service.sendLogin(),
            app.resource.load(mainScene),
        ]);

        loadComplete(mainScene);
    } catch (e) {
        throw new Error(e);
    }
}

main();
