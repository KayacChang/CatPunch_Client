import * as filters from 'pixi-filters';

function setFilter(view, filter) {
    if (!view.filters) view.filters = [];

    view.filters = [filter, ...view.filters];
}

export function BevelFilter(view, options) {
    const it = new filters.BevelFilter(options);

    setFilter(view, it);

    return it;
}

export function DropShadowFilter(view, options) {
    const it =
        new filters.DropShadowFilter(options);

    setFilter(view, it);

    return it;
}

export function BulgePinchFilter(view, {center, radius, strength}) {
    const it =
        new filters.BulgePinchFilter(center, radius, strength);

    setFilter(view, it);

    return it;
}

export function MotionBlurFilter(view) {
    const it = new filters.MotionBlurFilter();

    setFilter(view, it);

    let prevPos = 0;

    it.update = update;

    return it;

    function update(newPos) {
        const blurAmount = Math.max(0, (newPos - prevPos) * 100);
        it.velocity = [0, blurAmount];
        it.kernelSize = blurAmount;

        prevPos = newPos;
    }
}
