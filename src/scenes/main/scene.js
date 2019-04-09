import {Sprite} from 'pixi.js';

import {getResource} from '../../utils/resource';

import BG_URL from './assets/background.jpeg';

import {config} from './data';
import {Slot} from '../../components/slot';

export function reserve() {
    return [
        {name: 'background', url: BG_URL},
        ...(config.symbols),
    ];
}

export function create() {
    const background = new Sprite(
        getResource('background').texture,
    );

    background.width = app.screen.width;
    background.height = app.screen.height;

    const slot = new Slot(config);

    window.slot = slot;

    app.stage.addChild(background, slot.view);
}
