import MobileDetect from 'mobile-detect';

function getClientSize(target) {
    const {clientWidth, clientHeight} = target;
    return {width: clientWidth, height: clientHeight};
}

function getWindowSize() {
    return getClientSize(document.documentElement);
}

function setSize(target, {width, height}) {
    target.width = width;
    target.height = height;
}

function setStyleSize(target, {width, height}) {
    target.style.width = width + 'px';
    target.style.height = height + 'px';
}

export function resize(app) {
    const size = getExpectSize();

    setStyleSize(app.view.parentNode, size);
    setSize(app.view, size);
    app.renderer.resize(size.width, size.height);

    const rootScene = app.stage.children[0];
    if (rootScene) setSize(rootScene, size);
}

export function isMobile() {
    const detector =
        new MobileDetect(navigator.userAgent);

    return detector.mobile();
}

export function isLandScape() {
    return matchMedia('all and (orientation:landscape)').matches;
}

export function getExpectSize() {
    if (isMobile()) return getWindowSize();

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
