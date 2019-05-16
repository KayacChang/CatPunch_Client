import LOAD_URL from './assets/sprite_sheets/load.fui';
import LOAD_ATLAS0_URL from './assets/sprite_sheets/load@atlas0.png';
import LOAD_ATLAS0_1_URL from './assets/sprite_sheets/load@atlas0_1.png';
import LOAD_ATLAS0_2_URL from './assets/sprite_sheets/load@atlas0_2.png';

import {addPackage} from 'pixi_fairygui';

export function reserve() {
    return [
        {name: 'load.fui', url: LOAD_URL, xhrType: 'arraybuffer'},
        {name: 'load@atlas0.png', url: LOAD_ATLAS0_URL},
        {name: 'load@atlas0_1.png', url: LOAD_ATLAS0_1_URL},
        {name: 'load@atlas0_2.png', url: LOAD_ATLAS0_2_URL},
    ];
}

export function create() {
    const create = addPackage(app, 'load');
    return create('LoadScene');
}
