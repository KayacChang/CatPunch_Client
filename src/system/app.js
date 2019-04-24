import './styles/reset.css';
import './styles/app.css';

import {getElement, getAllElement, remove} from '../utils/dom';

import {Application} from 'pixi.js';
import {ResizeListener, getExpectSize} from './screen';
import {load} from './loader';
import {Sound} from './sound';
import {Network} from './network';


function init() {
    const view = getElement('#game');
    const size = getExpectSize();

    global.app = new Application({
        view,
        ...size,
        autoResize: true,
    });

    //  Sound Engine
    app.sound = Sound();
    //  Network Engine
    app.network = Network();
}

function removeScript() {
    return getAllElement('script')
        .forEach(remove);
}

function setResizeListener() {
    return ResizeListener(
        getElement('#container'),
    );
}

async function main() {
    init();

    const mainScene = await import('../scenes/main/scene');

    load(mainScene)
        .then(mainScene.create)
        .then(setResizeListener)
        .then(removeScript);
}

main();
