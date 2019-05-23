import {
    select,
    clear,
} from './web/utils/dom';

import {App} from './system/application';
import {Service} from './service/01/';
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
    try {
        global.app = new App(Service);

        const result = await app.service.login();
        console.log(result);

        const initData = await app.service.init();
        console.log(initData);

        // const refresh = await app.service.refresh();
        // console.log(refresh);

        // const exchange = await app.service.exchange({type: '1', amount: 10});
        // console.log(exchange);

        // const checkout = await app.service.checkout();
        // console.log(checkout);

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
        // const scene = MainScene.create(initData);
        // scene.addChild(ui);

        app.stage.addChildAt(ui, 0);

        // app.once('GameReady', () => {
        app.stage.removeChild(loadScene);
        app.resize();
        // });
    } catch (err) {
        console.error(err);
    }
}

main();
