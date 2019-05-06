import {floor, divide} from 'mathjs';
import anime from 'animejs';
import {wait} from '../../../utils/time';
import {
    MotionBlurFilter, BulgePinchFilter, DropShadowFilter,
} from '../plugin/filter';

export function SlotMachine(machine, config) {
    const {
        STOP_PER_SYMBOL,
        REEL_TABLE,
        SYMBOL_CONFIG,
        SPIN_DURATION,
        TIME_INTERVAL_PER_REEL,
    } = config;

    const SYMBOL_TEXTURES =
        SYMBOL_CONFIG.map(({id, name}) =>
            ({id, texture: app.resource.get(name).texture}));

    const reels =
        machine.children
            .filter(isReel)
            .map(Reel);

    return {play};

    function play(result) {
        reels.forEach(playSpinAnimation);

        async function playSpinAnimation(reel, reelIdx) {
            const spinAnimation = anime({
                targets: reel,
                axis: '+=' + 77,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            await wait(SPIN_DURATION + (reelIdx * TIME_INTERVAL_PER_REEL));

            const targetAxis = toAxis(reelIdx, result[reelIdx]);

            reel.axis = targetAxis - reel.displayLength;

            anime({
                targets: reel,
                axis: targetAxis,
                easing: 'easeOutElastic(1, .2)',
                duration: 500,
            });

            spinAnimation.pause();
        }
    }

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
                view.y = newPos * distancePerStop;

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

    function isReel({name}) {
        return name.includes('reel');
    }

    function isSymbol({name}) {
        return name.includes('symbol');
    }

    function reelLength(reelIdx) {
        return REEL_TABLE[reelIdx].length;
    }

    function toReelPos(reelIdx, axis) {
        const maxLength = reelLength(reelIdx);
        return (maxLength - floor(axis)) % maxLength;
    }

    function toAxis(reelIdx, reelPos) {
        const maxLength = reelLength(reelIdx);
        return (maxLength - reelPos) % maxLength;
    }

    function getTexture(icon) {
        return SYMBOL_TEXTURES
            .find(({id}) => id === icon)
            .texture;
    }

    function Reel(view, reelIdx) {
        let axis = 0;

        let reelPos = toReelPos(reelIdx, axis);

        const symbols =
            view.children
                .filter(isSymbol)
                .map(Symbol);

        const distancePerSymbol = symbols[1].y;

        const distancePerStop = divide(distancePerSymbol, STOP_PER_SYMBOL);

        symbols.forEach((symbol) => {
            symbol.distancePerStop = distancePerStop;
        });

        const motionBlurFilter = MotionBlurFilter(view);

        BulgePinchFilter(view, {
            center: [1 - (reelIdx / 2), 0.5],
            radius: 700,
            strength: 0.05,
        });

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
                axis = newAxis % reelLength(reelIdx);

                reelPos = toReelPos(reelIdx, axis);

                motionBlurFilter.update(axis);

                update(this, axis);
            },
        };
    }

    function update(reel, axis) {
        reel.symbols
            .forEach((symbol) => {
                updatePos(symbol);
                updateIcon(symbol);
            });

        function updatePos(symbol) {
            const initialPos = symbol.symbolIdx * STOP_PER_SYMBOL;

            symbol.displayPos = (axis + initialPos) % reel.displayLength;
        }

        function updateIcon(symbol) {
            if (symbol.readyToChange && symbol.displayPos === 0) {
                symbol.icon = reel.reelTable[reel.reelPos];
            }
        }
    }
}

