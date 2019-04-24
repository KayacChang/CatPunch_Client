import MAIN_URL from './assets/main.fui';
import MAIN_ATLAS0_URL from './assets/main@atlas0.png';
import MAIN_ATLAS0_1_URL from './assets/main@atlas0_1.png';
import MAIN_WAV_URL from './assets/sounds/main.wav';

import {config} from './data';
import {addPackage} from 'pixi_fairygui';
import {NumberPad} from '../../components/form/NumberPad';

export function reserve() {
    return {
        'pixi': [
            {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
            {name: 'main@atlas0.png', url: MAIN_ATLAS0_URL},
            {name: 'main@atlas0_1.png', url: MAIN_ATLAS0_1_URL},
            ...(config.symbolConfig),
        ],
        'howler': [
            {name: 'main', src: MAIN_WAV_URL},
        ],
    };
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage.addChild(scene);

    const numberPad = scene.getChildByName('NumberPad');

    const pad = NumberPad(numberPad);

    pad.on('input',
        (event) => console.log(event.value));
}
