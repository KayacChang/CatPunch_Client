import './styles/reset.css';
import './styles/app.css';

import {Application} from 'pixi.js';
import {addResizeListener, getExpectSize} from './resize';
import {load} from './loader';
import {Sound} from './sound';
import {Network} from './network';

function init() {
    const {width, height} = getExpectSize();

    global.app = new Application({
        width, height,
        view: document.querySelector('#game'),
    });

    app.view.style.height = '100%';
    app.view.style.width = '100%';

    //  Sound Engine
    app.sound = Sound();
    //  Network Engine
    app.network = Network();
}

async function main() {
    init();

    const mainScene = await import('../scenes/main/scene');

    load(mainScene)
        .then(mainScene.create)
        .then(() =>
            addResizeListener(document.querySelector('#container'))
        )
        .then(() => {
            document.querySelectorAll('script')
                .forEach((script) => script.remove());
        });
}

main();
