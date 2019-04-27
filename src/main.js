import {getAllElement, getElement, remove} from './utils/dom';

import {App} from './system/application';

const gameView = getElement('#game');

function clean() {
    getAllElement('script').forEach(remove);
    gameView.classList.remove('hidden');
}

async function main() {
    global.app = new App(gameView);

    const mainScene = await import('./scenes/main/scene');

    app.resource
        .load(mainScene)
        .then(mainScene.create)
        .then(clean)
        .then(app.resize);
}

main();
