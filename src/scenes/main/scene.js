import {Sprite} from 'pixi.js';

import {getResource} from '../../utils/resource';

import BG_URL from './assets/background.jpeg';

export function reserve() {
    return [
        {name: 'background', url: BG_URL},
        ...symbols,
    ];
}

export function create() {
    const background = new Sprite(
        getResource('background').texture,
    );

    background.width = app.renderer.width;
    background.height = app.renderer.height;

    const symbols = symbols
        .map((data) => {
            data.texture =
                getResource(data.name).texture;
            return data;
        });

    app.stage.addChild(background);
}
