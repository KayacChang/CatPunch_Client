import './system/app.css';
import {Application} from 'pixi.js';
import {addResizeListener} from './resize';
import {load} from './load';

import {create} from '../game/mainScene';

const DEFAULT_WIDTH = 1660;
const DEFAULT_HEIGHT = 900;

async function init() {
    global.app = new Application({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    });

    document.querySelector('#app')
        .appendChild(app.view);

    addResizeListener(app.view);
}

function main() {
    init()
        .then(load)
        .then(create);
}

main();
