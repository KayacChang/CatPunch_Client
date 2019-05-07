import {floor, divide} from 'mathjs';
import {
    MotionBlurFilter,
    DropShadowFilter,
} from '../plugin/filter';

import {
    TextureManager,
    isReel,
    isSymbol,
    toReelPos,
    update,
} from './util';

export function SlotMachine(machine, config) {
    const {
        STOP_PER_SYMBOL,
        REEL_TABLE,
        SYMBOL_CONFIG,
    } = config;

    const {getTexture} = TextureManager(SYMBOL_CONFIG);

    const reels =
        machine.children
            .filter(isReel)
            .map(Reel);

    return {reels};

    function Symbol(view, symbolIdx) {
        let displayPos = 0;

        let icon = 0;

        let readyToChange = false;

        let distancePerStop =
            divide(Number(view.height), STOP_PER_SYMBOL);

        return {
            get readyToChange() {
                return readyToChange;
            },

            get symbolIdx() {
                return symbolIdx;
            },

            get stopPerSymbol() {
                return STOP_PER_SYMBOL;
            },

            get distancePerStop() {
                return distancePerStop;
            },
            set distancePerStop(newDistance) {
                distancePerStop = newDistance;
            },

            get displayPos() {
                return displayPos;
            },
            set displayPos(newPos) {
                view.y = (newPos * distancePerStop);

                displayPos = floor(newPos);

                if (displayPos > 0) readyToChange = true;
            },

            get y() {
                return Number(view.y);
            },

            get icon() {
                return icon;
            },
            set icon(iconId) {
                view.texture = getTexture(iconId);
                icon = iconId;
                readyToChange = false;
            },
        };
    }

    function Reel(view, reelIdx) {
        let axis = 0;

        let reelPos = toReelPos(REEL_TABLE[reelIdx], axis);

        const symbols =
            view.children
                .filter(isSymbol)
                .map(Symbol);

        const distancePerSymbol = symbols[1].y;

        const distancePerStop = divide(distancePerSymbol, STOP_PER_SYMBOL);

        symbols
            .forEach((symbol) => symbol.distancePerStop = distancePerStop);

        const motionBlurFilter = MotionBlurFilter(view);

        DropShadowFilter(view, {
            blur: 3.2,
            quality: 3,
            alpha: 0.58,
            distance: 15,
            rotation: [45, 90, 135][reelIdx],
        });

        return {
            get reelIdx() {
                return reelIdx;
            },
            get reelTable() {
                return REEL_TABLE[reelIdx];
            },
            get symbols() {
                return symbols;
            },
            get displayLength() {
                return symbols.length * STOP_PER_SYMBOL;
            },
            get reelPos() {
                return reelPos;
            },
            get axis() {
                return axis;
            },
            set axis(newAxis) {
                axis = newAxis % (REEL_TABLE[reelIdx].length);

                reelPos = toReelPos(reelIdx, axis);

                motionBlurFilter.update(axis);

                update(this, axis);
            },
        };
    }
}

