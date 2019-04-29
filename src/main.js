import {
    getAllElements, getElement, removeElement,
    addClass, removeClass, render,
} from './utils/dom';

import * as loadScene from './scenes/load/scene';

import {App} from './system/application';

function removeAllScript() {
    return getAllElements('script')
        .forEach(removeElement);
}

async function main() {
    //  Loading
    const load = loadScene.create();
    render(load, getElement('#app'));

    //  Init App
    global.app = new App();
    render(app.view, getElement('#app'));

    //  Hide App Screen
    addClass(app.view, 'hidden');
    app.resize();

    //  Import Main Scene
    const mainScene = await import('./scenes/main/scene');
    app.resource
        .load(mainScene)
        .then(mainScene.create)
        .then(init);

    function init() {
        removeAllScript();

        //  Show App Screen
        addClass(load, 'hidden');
        removeClass(app.view, 'hidden');
        app.resize();
    }
}

main();
