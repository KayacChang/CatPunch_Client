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
import MAIN_ATLAS0_17_URL from './assets/sprite_sheets/main@atlas0_17.png';

import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from '../../components/slot';

import {symbolConfig, stopPerSymbol, reelTables, distancePerStop} from './data';
import {spin} from './spin';

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
        {name: 'main@atlas0_17.png', url: MAIN_ATLAS0_17_URL},
        ...(symbolConfig),
    ];
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage
        .addChild(scene);

    const view = scene.getChildByName('SlotMachine');

    const slot = SlotMachine({
        view,
        stopPerSymbol,
        reelTables,
        symbolConfig,
        distancePerStop,
        spin,
    });

    window.play = function(result) {
        slot.spin({
            'indexOfEachWheel': result,
            'enum_SymboTableForTable':
                result.map((pos, index) => reelTables[index][pos]),
        });
    };
}
