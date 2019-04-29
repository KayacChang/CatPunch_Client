import './styles/App.scss';

import {Application, utils} from 'pixi.js';
import {Sound} from './sound';
import {Network} from './network';
import {Resource} from './resource';
import {resize} from './screen';

const {defineProperties, assign, freeze} = Object;

/**
 *
 * @return {Readonly<PIXI.Application>}
 */
export function App() {
    const app =
        new Application({resolution: devicePixelRatio});

    //  Resource
    const resource = Resource(app);
    //  Sound
    const sound = Sound(app);
    //  Network
    const network = Network();

    //  Modules
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

    //  EventCore
    const eventCore = new utils.EventEmitter();

    //  Functions
    assign(app, {
        //  EventEmitter ==================
        on(event, listener) {
            eventCore.on(event, listener);
        },
        once(event, listener) {
            eventCore.once(event, listener);
        },
        emit(event, ...args) {
            eventCore.emit(event, ...args);
        },
        //  Screen Management ==================
        resize() {
            resize(app);
        },
    });

    //  Event Binding
    global.addEventListener('resize', app.resize);
    global.addEventListener('orientationchange', app.resize);

    //  Unchangeable
    return freeze(app);
}
