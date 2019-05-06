import MAIN_URL from './assets/main.fui';
import MAIN_ATLAS0_URL from './assets/main@atlas0.png';
import MAIN_ATLAS0_1_URL from './assets/main@atlas0_1.png';

import {config} from './data';
import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from '../../../components/game/slot/slot';

export function reserve() {
    return [
        {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
        {name: 'main@atlas0.png', url: MAIN_ATLAS0_URL},
        {name: 'main@atlas0_1.png', url: MAIN_ATLAS0_1_URL},
        ...(config.SYMBOL_CONFIG),
    ];
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage
        .addChild(scene);

    const slotContainer =
        scene
            .getChildByName('SlotMachine');

    const slotBaseView =
        slotContainer
            .getChildByName('SlotBase');

    const slot = SlotMachine(slotBaseView, config);

    window.play = slot.play;
}
