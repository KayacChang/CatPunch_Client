import {isMobile} from 'pixi.js/lib/core/utils';
// import alert from '../../web/components/swal';
import {debounce} from 'lodash';
import {abs} from 'mathjs';
import {select} from '../../general/utils/dom';

function getClientSize(target) {
    const {clientWidth, clientHeight} = target;
    return {width: clientWidth, height: clientHeight};
}

function getWindowSize() {
    return getClientSize(document.documentElement);
}

export function isLandScape() {
    return matchMedia('all and (orientation:landscape)').matches;
}

function getExpectSize() {
    // if (isMobile.phone) return getWindowSize();

    const size = getWindowSize();

    const expectRadio = (16 / 9);
    const currentRadio = (size.width / size.height);

    if (currentRadio > expectRadio) {
        size.width = size.height * expectRadio;
    } else {
        size.height = size.width / expectRadio;
    }

    return size;
}

function setSize(target, {width, height}) {
    target.width = width;
    target.height = height;
}

function setStyleSize(target, {width, height}) {
    if (!target) return;
    target.style.width = width + 'px';
    target.style.height = height + 'px';
}

export async function enableFullScreenMask() {
    if (!isMobile.phone) return;

    const icon = select('#icon');
    const mask = select('#mask');

    // const scroll = select('#screen-scroll');
    // const rotation = select('#screen-rotation');

    // if (document.documentElement.requestFullscreen) {
    //     icon.classList.remove('hidden');
    //     scroll.classList.add('hidden');
    //
    //     window.addEventListener('resize', () =>
    //         icon.classList.toggle('hidden', isDisplayNone(rotation)),
    //     );
    //
    //   const {value} = await alert.request({title: 'Enable FullScreen Mode'});
    //     if (value) return select('#app').requestFullscreen();
    // } else {
    icon.classList.remove('hidden');
    mask.classList.remove('hidden');

    window.addEventListener('touchmove', handle());
    window.addEventListener('resize', handle());
    window.addEventListener('orientationchange', handle());

    // }

    function handle() {
        return debounce(() => {
            requestAnimationFrame(() => {
                const isMinimal =
                    (isMobile.apple.device) ? forApple() : forAndroid();

                const func =
                    (el, className) => isMinimal ?
                        el.classList.add(className) :
                        el.classList.remove(className);

                func(icon, 'hidden');
                func(mask, 'hidden');
            });
        }, 200, {leading: true, trailing: true, maxWait: 60});
    }

    function forApple() {
        return abs(outerHeight - innerHeight) <= 30;
    }

    function forAndroid() {
        if (!isLandScape()) return false;

        const {clientHeight} = document.documentElement;
        return abs(innerHeight - clientHeight) >= 30;
    }

    // function isDisplayNone(element) {
    //     return getComputedStyle(element, null).display === 'none';
    // }
}

export function resize(app) {
    const size = getExpectSize();

    setStyleSize(app.view.parentElement, size);
    setSize(app.view, size);

    app.renderer
        .resize(size.width, size.height);

    const rootScene = app.stage.children[0];
    if (rootScene) {
        const expectStageSize = {width: 1920, height: 1080};
        rootScene.scale.x = size.width / expectStageSize.width;
        rootScene.scale.y = size.height / expectStageSize.height;
    }
}
