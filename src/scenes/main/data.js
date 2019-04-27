import SYMBOL_WILD_KOI from './assets/symbols/wild_koi.png';
import SYMBOL_WILD_NEKO from './assets/symbols/wild_neko.png';
import SYMBOL_WILD_TAIKO from './assets/symbols/wild_taiko.png';
import SYMBOL_BAR_01 from './assets/symbols/bar01.png';
import SYMBOL_BAR_02 from './assets/symbols/bar02.png';
import SYMBOL_BAR_03 from './assets/symbols/bar03.png';
import SYMBOL_SEVEN_01 from './assets/symbols/seven01.png';
import SYMBOL_SEVEN_02 from './assets/symbols/seven02.png';

import REEL_TABLE from './assets/reelTable';

const SYMBOL_CONFIG = [
    {id: 0, name: 'bar01', url: SYMBOL_BAR_01},
    {id: 1, name: 'bar02', url: SYMBOL_BAR_02},
    {id: 2, name: 'bar03', url: SYMBOL_BAR_03},
    {id: 3, name: 'seven01', url: SYMBOL_SEVEN_01},
    {id: 4, name: 'seven02', url: SYMBOL_SEVEN_02},
    {id: 5, name: 'koi', url: SYMBOL_WILD_KOI},
    {id: 6, name: 'neko', url: SYMBOL_WILD_NEKO},
    {id: 7, name: 'taiko', url: SYMBOL_WILD_TAIKO},
];

export const config = {
    SYMBOL_CONFIG,

    REEL_TABLE,

    STOP_PER_SYMBOL: 2,

    SPIN_DURATION: 2000,

    TIME_INTERVAL_PER_REEL: 450,
};
