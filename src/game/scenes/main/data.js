import SYMBOL_WILD_KOI from './assets/symbols/wild_koi.png';
import SYMBOL_WILD_NEKO from './assets/symbols/wild_neko.png';
import SYMBOL_WILD_TAIKO from './assets/symbols/wild_taiko.png';
import SYMBOL_BAR_01 from './assets/symbols/bar01.png';
import SYMBOL_BAR_02 from './assets/symbols/bar02.png';
import SYMBOL_BAR_03 from './assets/symbols/bar03.png';
import SYMBOL_SEVEN_01 from './assets/symbols/seven01.png';
import SYMBOL_SEVEN_02 from './assets/symbols/seven02.png';

import REEL_TABLES_URL from './assets/reelTable.json';
import MAIN_URL from './assets/sprite_sheets/main.fui';
import MAIN_ATLAS0_URL from './assets/sprite_sheets/main@atlas0.png';
import MAIN_ATLAS0_1_URL from './assets/sprite_sheets/main@atlas0_1.png';
import MAIN_ATLAS0_2_URL from './assets/sprite_sheets/main@atlas0_2.png';
import MAIN_ATLAS0_3_URL from './assets/sprite_sheets/main@atlas0_3.png';
import MAIN_ATLAS0_4_URL from './assets/sprite_sheets/main@atlas0_4.png';
import MAIN_ATLAS0_5_URL from './assets/sprite_sheets/main@atlas0_5.png';
import MAIN_ATLAS0_6_URL from './assets/sprite_sheets/main@atlas0_6.png';
import MAIN_ATLAS0_7_URL from './assets/sprite_sheets/main@atlas0_7.png';
import MAIN_ATLAS0_8_URL from './assets/sprite_sheets/main@atlas0_8.png';
import MAIN_ATLAS0_9_URL from './assets/sprite_sheets/main@atlas0_9.png';
import MAIN_ATLAS0_10_URL from './assets/sprite_sheets/main@atlas0_10.png';
import MAIN_ATLAS0_11_URL from './assets/sprite_sheets/main@atlas0_11.png';
import MAIN_ATLAS0_12_URL from './assets/sprite_sheets/main@atlas0_12.png';
import MAIN_ATLAS0_13_URL from './assets/sprite_sheets/main@atlas0_13.png';
import MAIN_ATLAS0_14_URL from './assets/sprite_sheets/main@atlas0_14.png';
import MAIN_ATLAS0_15_URL from './assets/sprite_sheets/main@atlas0_15.png';
import MAIN_ATLAS0_16_URL from './assets/sprite_sheets/main@atlas0_16.png';

import MAIN_BGM from './assets/sounds/MainBGM.mp3';

import * as coin from '../../components/coin';

export const symbolConfig = [
    {id: 7, name: 'bar01', url: SYMBOL_BAR_01},
    {id: 1, name: 'bar02', url: SYMBOL_BAR_02},
    {id: 2, name: 'bar03', url: SYMBOL_BAR_03},
    {id: 3, name: 'seven01', url: SYMBOL_SEVEN_01},
    {id: 4, name: 'seven02', url: SYMBOL_SEVEN_02},
    {id: 5, name: 'koi', url: SYMBOL_WILD_KOI},
    {id: 6, name: 'neko', url: SYMBOL_WILD_NEKO, maybeBonus: true},
    {id: 0, name: 'taiko_5', url: SYMBOL_WILD_TAIKO},
    {id: 8, name: 'taiko_7', url: SYMBOL_WILD_TAIKO},
    {id: 9, name: 'taiko_10', url: SYMBOL_WILD_TAIKO},
];


export function reserve() {
    return [
        {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
        {name: 'main@atlas0.png', url: MAIN_ATLAS0_URL},
        {name: 'main@atlas0_1.png', url: MAIN_ATLAS0_1_URL},
        {name: 'main@atlas0_2.png', url: MAIN_ATLAS0_2_URL},
        {name: 'main@atlas0_3.png', url: MAIN_ATLAS0_3_URL},
        {name: 'main@atlas0_4.png', url: MAIN_ATLAS0_4_URL},
        {name: 'main@atlas0_5.png', url: MAIN_ATLAS0_5_URL},
        {name: 'main@atlas0_6.png', url: MAIN_ATLAS0_6_URL},
        {name: 'main@atlas0_7.png', url: MAIN_ATLAS0_7_URL},
        {name: 'main@atlas0_8.png', url: MAIN_ATLAS0_8_URL},
        {name: 'main@atlas0_9.png', url: MAIN_ATLAS0_9_URL},
        {name: 'main@atlas0_10.png', url: MAIN_ATLAS0_10_URL},
        {name: 'main@atlas0_11.png', url: MAIN_ATLAS0_11_URL},
        {name: 'main@atlas0_12.png', url: MAIN_ATLAS0_12_URL},
        {name: 'main@atlas0_13.png', url: MAIN_ATLAS0_13_URL},
        {name: 'main@atlas0_14.png', url: MAIN_ATLAS0_14_URL},
        {name: 'main@atlas0_15.png', url: MAIN_ATLAS0_15_URL},
        {name: 'main@atlas0_16.png', url: MAIN_ATLAS0_16_URL},
        {name: 'reelTable.json', url: REEL_TABLES_URL},
        {
            name: 'mainBGM',
            url: MAIN_BGM,
            metadata: {html5: true, loop: true},
        },
        ...(symbolConfig),
        ...coin.reserve(),
    ];
}

export const stopPerSymbol = 2;
export const spinDuration = 2500;
export const timeIntervalPerReel = 450;
export const maybeBonusFXDuration = 1000;
export const distancePerStop = 813 / 2;
