import {Application} from 'pixi.js';

import reelTable from './reelTable';

import {SlotMachine} from './slot';

function main(...args) {
    setup();

    loadResources();
}

function setup() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const app = new Application(width, height);
    document.body.appendChild(app.view);

    global.app = app;
}

function loadResources() {
    app.loader
        .add('assets/eggHead.png')
        .add('assets/flowerTop.png')
        .add('assets/helmLok.png')
        .add('assets/skully.png')
        .load(onCreate);
}

function onCreate() {
    const slotMachine = SlotMachine(reelTable);

    app.stage.addChild(slotMachine);
}

main();
