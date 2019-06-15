import './styles/App.scss';

import {Application} from 'pixi.js';
import EventEmitter from 'eventemitter3';
import {Sound} from './modules/sound';
import {Network} from './modules/network';
import {Resource} from './modules/resource';
import {resize} from './modules/screen';

import Swal from '../plugin/swal';

import {debounce, isMobile} from '../general';

const {defineProperties, assign, freeze} = Object;

export function App(Service) {
    const app =
        new Application({
            resolution: devicePixelRatio,
            antialias: true,
            forceCanvas: isMobile.phone,
        });

    //  Resource
    const resource = Resource(app);
    //  Sound
    const sound = Sound(app);
    //  Network
    const network = Network();
    //  Service
    const service = Service && Service(network);
    //  Alert
    const alert = Swal();
    //  User
    let user = undefined;
    //  Control
    let control = undefined;

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
        service: {
            get: () => service,
        },
        alert: {
            get: () => alert,
        },
        user: {
            get: () => user,
            set: (newUser) => user = newUser,
        },
        control: {
            get: () => control,
            set: (newControl) => control = newControl,
        },
    });

    //  EventCore
    const eventCore = new EventEmitter();

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
            app.emit('resize');
        },
    });

    //  Event Binding
    global.addEventListener('resize', debounce(app.resize, 200));
    global.addEventListener('orientationchange', debounce(app.resize, 200));

    return freeze(app);
}
