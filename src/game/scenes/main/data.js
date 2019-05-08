import SYMBOL_WILD_KOI from './assets/symbols/wild_koi.png';
import SYMBOL_WILD_NEKO from './assets/symbols/wild_neko.png';
import SYMBOL_WILD_TAIKO from './assets/symbols/wild_taiko.png';
import SYMBOL_BAR_01 from './assets/symbols/bar01.png';
import SYMBOL_BAR_02 from './assets/symbols/bar02.png';
import SYMBOL_BAR_03 from './assets/symbols/bar03.png';
import SYMBOL_SEVEN_01 from './assets/symbols/seven01.png';
import SYMBOL_SEVEN_02 from './assets/symbols/seven02.png';

import REEL_TABLES from './assets/reelTable';

export const symbolConfig = [
    {id: 0, name: 'bar01', url: SYMBOL_BAR_01},
    {id: 1, name: 'bar02', url: SYMBOL_BAR_02},
    {id: 2, name: 'bar03', url: SYMBOL_BAR_03},
    {id: 3, name: 'seven01', url: SYMBOL_SEVEN_01},
    {id: 4, name: 'seven02', url: SYMBOL_SEVEN_02},
    {id: 5, name: 'koi', url: SYMBOL_WILD_KOI},
    {id: 6, name: 'neko', url: SYMBOL_WILD_NEKO, maybeBonus: true},
    {id: 7, name: 'taiko_5', url: SYMBOL_WILD_TAIKO},
    {id: 8, name: 'taiko_7', url: SYMBOL_WILD_TAIKO},
    {id: 9, name: 'taiko_10', url: SYMBOL_WILD_TAIKO},
];

export const reelTables = REEL_TABLES;
export const stopPerSymbol = 2;
export const spinDuration = 2500;
export const timeIntervalPerReel = 450;
export const maybeBonusFXDuration = 1000;
export const distancePerStop = 813 / 2;
