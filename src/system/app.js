import './app.css';

import {Application} from 'pixi.js';
import {addResizeListener} from './resize';
import {load} from './loader';
import {Sound} from './sound';

const DEFAULT_WIDTH = 1660;
const DEFAULT_HEIGHT = 900;

function init() {
    global.app = new Application({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    });

    document.querySelector('#container')
        .appendChild(app.view);

    addResizeListener(app.view);

    //  Add Sound Engine
    app.sound = new Sound();
}

async function main() {
    init();

    const mainScene = await import('../scenes/main/scene');

    load(mainScene)
        .then(mainScene.create);
}

main();
