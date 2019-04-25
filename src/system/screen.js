import MobileDetect from 'mobile-detect';

function getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {width, height};
}

function resizeScene(scene) {
    scene.width = app.screen.width;
    scene.height = app.screen.height;
    return scene;
}

function adjustToCenter(target, {width, height}) {
    target.style.marginLeft = offset(width);
    target.style.marginTop = offset(height);
    return target;

    function offset(num) {
        return (-num / 2) + 'px';
    }
}

function resetResolution(target) {
    target.style.transform = scale(target);
    return target;

    function scale({offsetWidth, offsetHeight}) {
        const {width, height} = getWindowSize();
        const scaleX = width / offsetWidth;
        const scaleY = height / offsetHeight;

        return `scale(${Math.min(scaleX, scaleY)})`;
    }
}

export function resize(app) {
    const size = getExpectSize();

    app.renderer
        .resize(size.width, size.height);

    const rootScene = app.stage.children[0];
    resizeScene(rootScene);

    const comp = app.view.parentNode;
    adjustToCenter(comp, size);
    resetResolution(comp);
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
