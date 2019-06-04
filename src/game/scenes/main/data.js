import SYMBOLS from './assets/symbols/icon.json';
import './assets/symbols/icon.png';

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

import EFFECT_TEXT_URL from './assets/fonts/effect-text.json';
import './assets/fonts/effect-text.png';
import FONT_EXPORT_URL from './assets/fonts/font-export.xml';
import './assets/fonts/font-export.png';
import COIN_DATA from './assets/coin/coin';
import './assets/coin/coin.png';

import NORMAL_BGM_MP3 from './assets/sounds/Normal_BGM.mp3';
import CAT_APPEAR_MP3 from './assets/sounds/Cat_Appear.mp3';
import CAT_HIT_1_MP3 from './assets/sounds/Cat_Hit1.mp3';
import CAT_HIT_2_MP3 from './assets/sounds/Cat_Hit2.mp3';
import MAYBE_BONUS_MP3 from './assets/sounds/MaybeBonus.mp3';
import NORMAL_CONNECT_MP3 from './assets/sounds/Normal_Connect.mp3';
import WILD_KOI_CONNECT_MP3 from './assets/sounds/Wild_Koi_Connect.mp3';
import WILD_NEKO_CONNECT_MP3 from './assets/sounds/Wild_Neko_Connect.mp3';
import WILD_TAIKO_CONNECT_MP3 from './assets/sounds/Wild_Taiko_Connect.mp3';
import REEL_BOUNCE_MP3 from './assets/sounds/ReelBounce.mp3';
import ENERGY_MP3 from './assets/sounds/Energy.mp3';
import FREE_SPIN_ALERT_MP3 from './assets/sounds/FreeSpinAlert.mp3';
import COIN_DROP_MP3 from './assets/sounds/CoinDrop.mp3';

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

const sounds = [
    {
        name: 'mainBGM',
        url: NORMAL_BGM_MP3,
        metadata: {html5: true, loop: true},
    },
    {
        name: 'freeSpinAlert',
        url: FREE_SPIN_ALERT_MP3,
        metadata: {loop: true},
    },
    {name: 'catAppear', url: CAT_APPEAR_MP3},
    {name: 'catHit1', url: CAT_HIT_1_MP3},
    {name: 'catHit2', url: CAT_HIT_2_MP3},
    {name: 'maybeBonus', url: MAYBE_BONUS_MP3},
    {name: 'normal', url: NORMAL_CONNECT_MP3},
    {name: 'koi', url: WILD_KOI_CONNECT_MP3},
    {name: 'neko', url: WILD_NEKO_CONNECT_MP3},
    {name: 'taiko', url: WILD_TAIKO_CONNECT_MP3},
    {name: 'bounce', url: REEL_BOUNCE_MP3},
    {name: 'energy', url: ENERGY_MP3},
    {name: 'coinDrop', url: COIN_DROP_MP3},
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
        {name: 'effect-text', url: EFFECT_TEXT_URL},
        {name: 'effect-number', url: FONT_EXPORT_URL},

        {name: 'symbols', url: SYMBOLS},
        {name: 'coin', url: COIN_DATA},

        ...(sounds),
    ];
}

export const stopPerSymbol = 2;
export const spinDuration = [3000, 2000, 1500];
export const spinStopInterval = [450, 300, 150];
export const maybeBonusFXDuration = 1000;
