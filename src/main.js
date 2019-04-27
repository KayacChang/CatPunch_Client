import {
    getAllElements, getElement, removeElement,
    addClass, removeClass, render,
} from './utils/dom';

import * as loadScene from './scenes/load/scene';

import {App} from './system/application';

async function main() {
    const load = loadScene.create();
    render(load, getElement('#app'));

    global.app = new App();
    render(app.view, getElement('#app'));

    addClass(app.view, 'hidden');
    app.resize();

    const mainScene = await import('./scenes/main/scene');
    app.resource
        .load(mainScene)
        .then(mainScene.create)
        .then(init);

    function init() {
        getAllElements('script')
            .forEach(removeElement);

        addClass(load, 'hidden');
        removeClass(app.view, 'hidden');
        app.resize();
    }
}

main();
