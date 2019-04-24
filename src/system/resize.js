import MobileDetect from 'mobile-detect';

function getWindowSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

function resizeScene(scene) {
    scene.width = app.screen.width;
    scene.height = app.screen.height;
    return scene;
}

function adjustToCenter(target, {width, height}) {
    target.style.marginLeft = (-width / 2) + 'px';
    target.style.marginTop = (-height / 2) + 'px';
    return target;
}

function resetResolution(target) {
    target.style.transform = scale(target);

    function scale({offsetWidth, offsetHeight}) {
        const {width, height} = getWindowSize();
        const scaleX = width / offsetWidth;
        const scaleY = height / offsetHeight;

        return `scale(${Math.min(scaleX, scaleY)})`;
    }
}

function scaleToWindow(target) {
    const size = getExpectSize();
    app.renderer.resize(
        size.width, size.height
    );

    adjustToCenter(target, size);

    resetResolution(target);

    const rootScene = app.stage.children[0];
    resizeScene(rootScene);
}

export function isMobile() {
    const detector =
        new MobileDetect(window.navigator.userAgent);

    return detector.mobile();
}

export function isLandScape() {
    return matchMedia('all and (orientation:landscape)').matches;
}

export function getExpectSize() {
    const size = getWindowSize();

    if (isMobile()) return size;

    const {width, height} = size;

    const expectRadio = (16 / 9);
    const currentRadio = (width / height);

    if (currentRadio > expectRadio) {
        size.width = height * expectRadio;
    } else {
        size.height = width / expectRadio;
    }

    return size;
}


export function addResizeListener(target) {
    window.addEventListener('resize', resize);

    resize();

    function resize() {
        scaleToWindow(target);
    }
}
