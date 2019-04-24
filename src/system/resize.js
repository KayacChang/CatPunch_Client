/*
    Scale the target to the correct size
    Figure out the scale amount on each axis
    And return the smaller one
*/
function getScale({offsetWidth, offsetHeight}) {
    const scaleX = window.innerWidth / offsetWidth;
    const scaleY = window.innerHeight / offsetHeight;

    return Math.min(scaleX, scaleY);
}

function scaleToWindow(target) {
    const {width, height} = getExpectSize();
    app.renderer.resize(width, height);

    const rootScene = app.stage.children[0];
    rootScene.width = app.screen.width;
    rootScene.height = app.screen.height;

    target.style.marginTop = (-height / 2) + 'px';
    target.style.marginLeft = (-width / 2) + 'px';

    target.style.transform = `scale(${getScale(target)})`;
}

export function getExpectSize() {
    const expectRadio = (16 / 9);

    let width = window.innerWidth;
    let height = window.innerHeight;
    const currentRadio = width / height;

    if (currentRadio > expectRadio) {
        width = height * expectRadio;
    } else {
        height = width / expectRadio;
    }

    return {width, height};
}


export function addResizeListener(target) {
    window.addEventListener('resize', resize);

    resize();

    function resize() {
        scaleToWindow(target);
    }
}
