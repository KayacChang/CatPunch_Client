import SYMBOLS from '../assets/symbols/icon.json';
import '../assets/symbols/icon.png';
import EFFECT_TEXT_URL from '../assets/fonts/effect-text.json';
import '../assets/fonts/effect-text.png';
import FONT_EXPORT_URL from '../assets/fonts/font-export.xml';
import '../assets/fonts/font-export.png';
import COIN_DATA from '../assets/coin/coin';
import '../assets/coin/coin.png';

import {sounds} from './sound';
import {sheets} from './spritesheet';

export const symbolConfig = [
    {id: 0, name: 'koi', texture: 'wild_koi.png'},
    {id: 1, name: 'neko', texture: 'wild_neko.png', maybeBonus: true},
    {id: 2, name: 'taiko@5x', texture: 'wild_taiko.png'},
    {id: 3, name: 'taiko@7x', texture: 'wild_taiko.png'},
    {id: 4, name: 'taiko@10x', texture: 'wild_taiko.png'},
    {id: 5, name: 'seven', texture: 'seven01.png'},
    {id: 6, name: 'seven@bar', texture: 'seven02.png'},
    {id: 7, name: 'bar@3', texture: 'bar03.png'},
    {id: 8, name: 'bar@2', texture: 'bar02.png'},
    {id: 9, name: 'bar@1', texture: 'bar01.png'},
];

export function reserve() {
    return [
        {name: 'effect-text', url: EFFECT_TEXT_URL},
        {name: 'effect-number', url: FONT_EXPORT_URL},

        {name: 'symbols', url: SYMBOLS},
        {name: 'coin', url: COIN_DATA},

        ...(sounds),
        ...(sheets),
    ];
}

export const stopPerSymbol = 2;
export const spinDuration = [3000, 2000, 1500];
export const spinStopInterval = [450, 300, 150];
export const maybeBonusFXDuration = 1000;
