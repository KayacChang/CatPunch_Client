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
    const scale = getScale(target);

    target.style.transform = `scale(${scale})`;

    if (window.innerWidth >= 1600) {
        app.renderer.resize(
            1660, 900,
        );
    } else {
        app.renderer.resize(
            1440, 900,
        );
    }
}


export function addResizeListener(target) {
    window.addEventListener('resize', resize);

    function resize() {
        scaleToWindow(target);
    }
}
