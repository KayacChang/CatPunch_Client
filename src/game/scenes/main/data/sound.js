import NORMAL_BGM_MP3
    from '../assets/sounds/mp3/Normal_BGM.mp3';
import CAT_APPEAR_MP3
    from '../assets/sounds/mp3/Cat_Appear.mp3';
import CAT_HIT_1_MP3
    from '../assets/sounds/mp3/Cat_Hit1.mp3';
import CAT_HIT_2_MP3
    from '../assets/sounds/mp3/Cat_Hit2.mp3';
import MAYBE_BONUS_MP3
    from '../assets/sounds/mp3/MaybeBonus.mp3';
import NORMAL_CONNECT_MP3
    from '../assets/sounds/mp3/Normal_Connect.mp3';
import WILD_KOI_CONNECT_MP3
    from '../assets/sounds/mp3/Wild_Koi_Connect.mp3';
import WILD_NEKO_CONNECT_MP3
    from '../assets/sounds/mp3/Wild_Neko_Connect.mp3';
import WILD_TAIKO_CONNECT_MP3
    from '../assets/sounds/mp3/Wild_Taiko_Connect.mp3';
import REEL_BOUNCE_MP3
    from '../assets/sounds/mp3/ReelBounce.mp3';
import ENERGY_MP3
    from '../assets/sounds/mp3/Energy.mp3';
import FREE_SPIN_ALERT_MP3
    from '../assets/sounds/mp3/FreeSpinAlert.mp3';
import COIN_DROP_MP3
    from '../assets/sounds/mp3/CoinDrop.mp3';

import NORMAL_BGM_WEBM
    from '../assets/sounds/webm/Normal_BGM.webm';
import CAT_APPEAR_WEBM
    from '../assets/sounds/webm/Cat_Appear.webm';
import CAT_HIT_1_WEBM
    from '../assets/sounds/webm/Cat_Hit1.webm';
import CAT_HIT_2_WEBM
    from '../assets/sounds/webm/Cat_Hit2.webm';
import MAYBE_BONUS_WEBM
    from '../assets/sounds/webm/MaybeBonus.webm';
import NORMAL_CONNECT_WEBM
    from '../assets/sounds/webm/Normal_Connect.webm';
import WILD_KOI_CONNECT_WEBM
    from '../assets/sounds/webm/Wild_Koi_Connect.webm';
import WILD_NEKO_CONNECT_WEBM
    from '../assets/sounds/webm/Wild_Neko_Connect.webm';
import WILD_TAIKO_CONNECT_WEBM
    from '../assets/sounds/webm/Wild_Taiko_Connect.webm';
import REEL_BOUNCE_WEBM
    from '../assets/sounds/webm/ReelBounce.webm';
import ENERGY_WEBM
    from '../assets/sounds/webm/Energy.webm';
import FREE_SPIN_ALERT_WEBM
    from '../assets/sounds/webm/FreeSpinAlert.webm';
import COIN_DROP_WEBM
    from '../assets/sounds/webm/CoinDrop.webm';

import NORMAL_BGM_OGG
    from '../assets/sounds/ogg/Normal_BGM.ogg';
import CAT_APPEAR_OGG
    from '../assets/sounds/ogg/Cat_Appear.ogg';
import CAT_HIT_1_OGG
    from '../assets/sounds/ogg/Cat_Hit1.ogg';
import CAT_HIT_2_OGG
    from '../assets/sounds/ogg/Cat_Hit2.ogg';
import MAYBE_BONUS_OGG
    from '../assets/sounds/ogg/MaybeBonus.ogg';
import NORMAL_CONNECT_OGG
    from '../assets/sounds/ogg/Normal_Connect.ogg';
import WILD_KOI_CONNECT_OGG
    from '../assets/sounds/ogg/Wild_Koi_Connect.ogg';
import WILD_NEKO_CONNECT_OGG
    from '../assets/sounds/ogg/Wild_Neko_Connect.ogg';
import WILD_TAIKO_CONNECT_OGG
    from '../assets/sounds/ogg/Wild_Taiko_Connect.ogg';
import REEL_BOUNCE_OGG
    from '../assets/sounds/ogg/ReelBounce.ogg';
import ENERGY_OGG
    from '../assets/sounds/ogg/Energy.ogg';
import FREE_SPIN_ALERT_OGG
    from '../assets/sounds/ogg/FreeSpinAlert.ogg';
import COIN_DROP_OGG
    from '../assets/sounds/ogg/CoinDrop.ogg';


export const sounds = [
    {
        type: 'sound',
        name: 'mainBGM',
        src: [
            NORMAL_BGM_WEBM,
            NORMAL_BGM_OGG,
            NORMAL_BGM_MP3,
        ],
        loop: true,
    },
    {
        type: 'sound',
        name: 'freeSpinAlert',
        src: [
            FREE_SPIN_ALERT_WEBM,
            FREE_SPIN_ALERT_OGG,
            FREE_SPIN_ALERT_MP3,
        ],
        loop: true,
    },
    {
        type: 'sound',
        name: 'catAppear',
        src: [
            CAT_APPEAR_WEBM,
            CAT_APPEAR_OGG,
            CAT_APPEAR_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'catHit1',
        src: [
            CAT_HIT_1_WEBM,
            CAT_HIT_1_OGG,
            CAT_HIT_1_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'catHit2',
        src: [
            CAT_HIT_2_WEBM,
            CAT_HIT_2_OGG,
            CAT_HIT_2_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'maybeBonus',
        src: [
            MAYBE_BONUS_WEBM,
            MAYBE_BONUS_OGG,
            MAYBE_BONUS_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'normal',
        src: [
            NORMAL_CONNECT_WEBM,
            NORMAL_CONNECT_OGG,
            NORMAL_CONNECT_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'koi',
        src: [
            WILD_KOI_CONNECT_WEBM,
            WILD_KOI_CONNECT_OGG,
            WILD_KOI_CONNECT_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'neko',
        src: [
            WILD_NEKO_CONNECT_WEBM,
            WILD_NEKO_CONNECT_OGG,
            WILD_NEKO_CONNECT_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'taiko',
        src: [
            WILD_TAIKO_CONNECT_WEBM,
            WILD_TAIKO_CONNECT_OGG,
            WILD_TAIKO_CONNECT_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'bounce',
        src: [
            REEL_BOUNCE_WEBM,
            REEL_BOUNCE_OGG,
            REEL_BOUNCE_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'energy',
        src: [
            ENERGY_WEBM,
            ENERGY_OGG,
            ENERGY_MP3,
        ],
    },
    {
        type: 'sound',
        name: 'coinDrop',
        src: [
            COIN_DROP_WEBM,
            COIN_DROP_OGG,
            COIN_DROP_MP3,
        ],
    },
];
