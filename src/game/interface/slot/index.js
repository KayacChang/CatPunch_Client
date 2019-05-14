import INTERFACE_URL from './assets/sprite_sheets/interface.fui';
import INTERFACE_ATLAS0_URL from './assets/sprite_sheets/interface@atlas0.png';

import {addPackage} from 'pixi_fairygui';

import {Main} from './main';
import {Menu} from './menu';

const fontsConfig = {
    google: {
        families: ['Candal'],
    },
};

export function reserve() {
    return [
        {name: 'interface.fui', url: INTERFACE_URL, xhrType: 'arraybuffer'},
        {name: 'interface@atlas0.png', url: INTERFACE_ATLAS0_URL},
        {name: 'font', url: '', metadata: fontsConfig},
    ];
}

export function create() {
    const create = addPackage(app, 'interface');
    const it = create('UserInterface');

    Main(it);

    Menu(it);

    app.stage.addChild(it);
}

