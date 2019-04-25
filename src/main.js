import {getAllElement, getElement, remove} from './utils/dom';

import {App} from './system/application';

function clean() {
    getAllElement('script').forEach(remove);
    getElement('#container').classList.remove('hidden');
}

async function main() {
    const view = getElement('#game');
    global.app = new App(view);

    const mainScene = await import('./scenes/main/scene');

    app.resource
        .load(mainScene)
        .then(mainScene.create)
        .then(clean)
        .then(app.resize);
}

main();
