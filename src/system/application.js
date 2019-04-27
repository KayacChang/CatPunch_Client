import './styles/App.scss';

import {Application, utils} from 'pixi.js';
import {Sound} from './sound';
import {Network} from './network';
import {Resource} from './resource';

import {resize} from './screen';

const {defineProperties, assign, freeze} = Object;

export function App() {
    const app =
        new Application({resolution: devicePixelRatio});

    //  EventCore
    const eventCore = new utils.EventEmitter();
    //  Resource
    const resource = Resource(app);
    //  Sound
    const sound = Sound(app);
    //  Network
    const network = Network();

    defineProperties(app, {
        resource: {
            get: () => resource,
        },
        sound: {
            get: () => sound,
        },
        network: {
            get: () => network,
        },
    });

    assign(app, {
        on(event, listener) {
            eventCore.on(event, listener);
        },
        once(event, listener) {
            eventCore.once(event, listener);
        },
        emit(event, ...args) {
            eventCore.emit(event, ...args);
        },
        resize() {
            resize(app);
        },
    });

    global.addEventListener('resize', app.resize);
    global.addEventListener('orientationchange', app.resize);

    return freeze(app);
}
