import {
    GlowFilter, BevelFilter, DropShadowFilter,
    BulgePinchFilter, MotionBlurFilter, AdvancedBloomFilter,
    OutlineFilter, ZoomBlurFilter,
} from 'pixi-filters';

import {filters} from 'pixi.js';

const {BlurFilter} = filters;

function setFilter(view, filter) {
    if (!view.filters) view.filters = [];

    view.filters = [filter, ...view.filters];

    return view;
}

export function setBlur(view, options = {}) {
    const {
        strength,
        quality,
        resolution,
        kernelSize,
        blur,
    } = options;

    const it = new BlurFilter(
        strength || 8,
        quality || 4,
        resolution,
        kernelSize || 5,
    );
    if (blur) it.blur = blur;

    setFilter(view, it);

    return it;
}

export function setZoom(view, options) {
    const {
        strength,
        center,
        innerRadius,
    } = options;

    const it = new ZoomBlurFilter(
        strength,
        center,
        innerRadius,
    );

    setFilter(view, it);

    return it;
}

export function setOutline(view, options) {
    const it = new OutlineFilter(options);

    setFilter(view, it);

    return it;
}

export function setAdvancedBloom(view, options) {
    const it = new AdvancedBloomFilter(options);

    setFilter(view, it);

    return it;
}

export function setGlow(view, options) {
    const {
        distance,
        outerStrength,
        innerStrength,
        color,
    } = options;

    const it = new GlowFilter(
        distance,
        outerStrength,
        innerStrength,
        color,
    );

    setFilter(view, it);

    return it;
}

export function setBevel(view, options) {
    const it = new BevelFilter(options);

    setFilter(view, it);

    return it;
}

export function setDropShadow(view, options) {
    const it = new DropShadowFilter(options);

    setFilter(view, it);

    return it;
}

export function setBulgePinch(view, {center, radius, strength}) {
    const it = new BulgePinchFilter(center, radius, strength);

    setFilter(view, it);

    return it;
}

export function setMotionBlur(view) {
    const it = new MotionBlurFilter();

    setFilter(view, it);

    it.update = update;

    return it;

    function update(newPos) {
        const blurAmount = Math.max(0, (newPos) * 100);
        it.velocity = [0, blurAmount];
        it.kernelSize = blurAmount;
    }
}
