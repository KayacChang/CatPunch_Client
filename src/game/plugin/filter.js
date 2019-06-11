import {
    GlowFilter, BevelFilter, DropShadowFilter,
    BulgePinchFilter, MotionBlurFilter, AdvancedBloomFilter,
    OutlineFilter, ZoomBlurFilter, GodrayFilter,
} from 'pixi-filters';

import {isMobile} from '../../general';

import {filters} from 'pixi.js';

const {BlurFilter, ColorMatrixFilter} = filters;

function setFilter(view, filter) {
    if (!view.filters) view.filters = [];

    view.filters = [filter, ...view.filters];

    return view;
}

export function setColorMatrix(view) {
    const it = new ColorMatrixFilter();

    if (!view.filters) view.filters = [];

    if (!isMobile.phone) view.filters.push(it);

    return it;
}

export function setBlur(view, options = {}) {
    if (isMobile.phone) return {};

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
    if (isMobile.phone) return {};

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

export function setOutline(view, options = {}) {
    if (isMobile.phone) return {};

    const {thickness, color, quality} = options;
    const it = new OutlineFilter(
        thickness || 1,
        color || 0x000000,
        quality || 0.1,
    );

    setFilter(view, it);

    return it;
}

export function setAdvancedBloom(view, options) {
    if (isMobile.phone) return {};

    const it = new AdvancedBloomFilter(options);

    setFilter(view, it);

    return it;
}

export function setGlow(view, options = {}) {
    if (isMobile.phone) return {};

    const {
        distance,
        outerStrength,
        innerStrength,
        color,
        quality,
    } = options;

    const it = new GlowFilter(
        distance || 10,
        outerStrength || 4,
        innerStrength || 0,
        color || 0xffffff,
        quality || 0.1,
    );

    setFilter(view, it);

    return it;
}

export function setBevel(view, options) {
    if (isMobile.phone) return {};

    const it = new BevelFilter(options);

    setFilter(view, it);

    return it;
}

export function setDropShadow(view, options) {
    if (isMobile.phone) return {};

    const it = new DropShadowFilter(options);

    setFilter(view, it);

    return it;
}

export function setGodray(view, options = {}) {
    if (isMobile.phone) return {};

    const {angle, gain, lacunrity, parallel, time, center} = options;

    const it = new GodrayFilter({
        angle: angle || 30,
        gain: gain || 0.5,
        lacunrity: lacunrity || 2.5,
        parallel: parallel !== undefined ? parallel : true,
        time: time || 0,
        center: center || [0, 0],
    });

    setFilter(view, it);

    return it;
}

export function setBulgePinch(view, {center, radius, strength}) {
    if (isMobile.phone) return {};

    const it = new BulgePinchFilter(center, radius, strength);

    setFilter(view, it);

    return it;
}

export function setMotionBlur(view) {
    const it = new MotionBlurFilter();

    it.update = update;

    setFilter(view, it);

    return it;

    function update(newPos) {
        const blurAmount = Math.max(0, (newPos) * 100);
        it.velocity = [0, blurAmount];
        it.kernelSize = blurAmount;
    }
}
