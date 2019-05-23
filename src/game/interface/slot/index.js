import INTERFACE_URL from './assets/sprite_sheets/interface.fui';
import INTERFACE_ATLAS0_URL from './assets/sprite_sheets/interface@atlas0.png';
import * as coin from '../../interface/components/coin';

import {addPackage} from 'pixi_fairygui';

import {Main} from './main';
import {Menu} from './menu';

const fontsConfig = {
    google: {
        families: ['Candal', 'Basic'],
    },
};

export function reserve() {
    return [
        {name: 'interface.fui', url: INTERFACE_URL, xhrType: 'arraybuffer'},
        {name: 'interface@atlas0.png', url: INTERFACE_ATLAS0_URL},
        {name: 'font', url: '', metadata: fontsConfig},
        ...coin.reserve(),
    ];
}

export function create() {
    const create = addPackage(app, 'interface');
    const it = create('UserInterface');

    it.menu = Menu(it);

    it.main = Main(it);

    return it;
}

