import MAIN_URL from './assets/main.fui';
import MAIN_ATLAS0_URL from './assets/main@atlas0.jpg';
import MAIN_WAV_URL from './assets/sounds/main.wav';

import {config} from './data';
import {addPackage} from 'pixi_fairygui';
import {RangeSlider} from '../../components/form/RangeSlider';

export function reserve() {
    return {
        'pixi': [
            {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
            {name: 'main@atlas0.jpg', url: MAIN_ATLAS0_URL},
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

    scene.width = app.screen.width;
    scene.height = app.screen.height;

    app.stage.addChild(scene);

    const rangeInput = scene.getChildByName('RangeInput');

    const controller = rangeInput.getChildByName('Controller');

    const rangeSlider = RangeSlider(controller);

    rangeSlider.on('input', function(event) {
        console.log(event.value);
    });
}
