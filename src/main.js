import {getAllElement, getElement, remove} from './utils/dom';

import {App} from './system/application';

function removeScript() {
    return getAllElement('script')
        .forEach(remove);
}

async function main() {
    const view = getElement('#game');
    global.app = new App(view);

    const mainScene = await import('./scenes/main/scene');

    app.resource
        .load(mainScene)
        .then(mainScene.create)
        .then(app.resize)
        .then(removeScript);
}

main();
