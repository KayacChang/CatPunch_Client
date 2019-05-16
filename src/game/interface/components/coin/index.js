import COIN_DATA from './assets/coin.json';
import './assets/coin.png';

import {extras} from 'pixi.js';

export function reserve() {
    return [
        {name: 'coin', url: COIN_DATA},
    ];
}

export function create() {
    const spriteSheet = app.resource.get('coin').spritesheet;

    const it = new extras.AnimatedSprite(spriteSheet.animations['coin']);

    it.play();

    return it;
}
