import MAIN_URL from './assets/main.fui';
import MAIN_ATLAS0_URL from './assets/main@atlas0.jpg';
import MAIN_WAV_URL from './assets/sounds/main.wav';

import {config} from './data';
import {addPackage} from 'pixi_fairygui';

export function reserve() {
    return [
        {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
        {name: 'main@atlas0.jpg', url: MAIN_ATLAS0_URL},
        {name: 'mainBGM', url: MAIN_WAV_URL},
        ...(config.symbolConfig),
    ];
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage.addChild(scene);
}
