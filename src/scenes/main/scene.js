import MAIN_URL from './assets/main.fui';
import MAIN_ATLAS0_URL from './assets/main@atlas0.png';

import {config} from './data';
import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from '../../components/slot';

export function reserve() {
    return [
        {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
        {name: 'main@atlas0.png', url: MAIN_ATLAS0_URL},
        ...(config.symbolConfig),
    ];
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    scene.setWidth(app.screen.width);
    scene.setHeight(app.screen.height);

    const slotMachineView = scene.getChildByName('SlotMachine');

    const slotMachine = SlotMachine(slotMachineView, config);

    window.slotMachine = slotMachine;

    app.stage.addChild(scene);
}
