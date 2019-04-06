import 'regenerator-runtime';

import {Sprite} from 'pixi.js';

import {getResource} from '../system/load';

export function create(loader) {
    console.log(loader);

    const background = new Sprite(
        getResource('background').texture,
    );

    background.width = DEFAULT_WIDTH;
    background.height = DEFAULT_HEIGHT;

    app.stage.addChild(background);
}
