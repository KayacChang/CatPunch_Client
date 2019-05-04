import {nth} from 'ramda';
import {abs, floor, divide} from 'mathjs';
import anime from 'animejs';
import {wait} from '../../../utils/time';

export function SlotMachine(view, config) {
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

    const symbolTable =
        view.children
            .filter(({name}) => name.includes('symbol'))
            .map(Symbol)
            .reduce((arr, symbol) => {
                const reelIdx = symbol.reelIdx;

                if (!arr[reelIdx]) arr[reelIdx] = [];

                arr[reelIdx].push(symbol);

                return arr;
            }, []);

    const reels =
        symbolTable.map((symbols, index) => {
            symbols.sort((a, b) => a.colIdx - b.colIdx);

            return Reel(symbols, REEL_TABLE[index]);
        });

    return {play};

    function play(result) {
        reels.forEach(async (reel, reelIdx) => {
            const maxLength = reel.reelTable.length;

            const targetAxis = (maxLength - result[reelIdx]) % maxLength;

            const spinAnimation = anime({
                targets: reel,
                axis: '+=' + 77,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            await wait(SPIN_DURATION + reelIdx * TIME_INTERVAL_PER_REEL);

            reel.axis = targetAxis - (reel.symbols.length * STOP_PER_SYMBOL);

            anime({
                targets: reel,
                axis: targetAxis,
                easing: 'easeOutElastic(1, .2)',
                duration: 500,
            });

            spinAnimation.pause();
        });
    }

    function getTexture(icon) {
        return SYMBOL_TEXTURES
            .find(({id}) => id === icon)
            .texture;
    }

    function Symbol(view) {
        const [reelIdx, colIdx] =
            view.name
                .replace('symbol@', '')
                .split('_')
                .map(Number);

        let icon = 0;

        return {
            get reelIdx() {
                return reelIdx;
            },
            get colIdx() {
                return colIdx;
            },
            get view() {
                return view;
            },

            stepSize:
                divide(Number(view.height), STOP_PER_SYMBOL),

            readyToChange: false,

            displayPos: 0,

            get icon() {
                return icon;
            },
            set icon(newIcon) {
                view.texture = getTexture(newIcon);

                icon = newIcon;
            },
        };
    }

    function Reel(symbols, reelTable) {
        let axis = 0;

        const DISPLAY_ORIGIN_POS = symbols[0].colIdx * STOP_PER_SYMBOL;
        const DISPLAY_ORIGIN_POINT = symbols[0].view.y;

        const stepSize = divide(
            abs(symbols[0].view.y - symbols[1].view.y),
            STOP_PER_SYMBOL,
        );

        symbols.forEach((symbol) => {
            symbol.stepSize = stepSize;

            const initPos = axis + (symbol.colIdx * STOP_PER_SYMBOL);

            symbol.icon = nth(initPos, reelTable);
        });

        const updateAxis = (newAxis) =>
            update(
                reelTable,
                symbols,
                newAxis,
                {
                    DISPLAY_ORIGIN_POS,
                    DISPLAY_ORIGIN_POINT,
                },
            );

        updateAxis(axis);

        return {
            get axis() {
                return axis;
            },
            set axis(newAxis) {
                axis = updateAxis(newAxis);
            },
            get reelTable() {
                return reelTable;
            },
            get symbols() {
                return symbols;
            },
        };
    }

    function update(reelTable, symbols, newAxis, options) {
        const DISPLAY_ORIGIN_POS = options.DISPLAY_ORIGIN_POS || 0;
        const DISPLAY_ORIGIN_POINT = options.DISPLAY_ORIGIN_POINT || 0;

        const MAX_LENGTH = reelTable.length;

        const axis = newAxis % MAX_LENGTH;

        updateDisplayPos(axis);

        return axis;

        function updateDisplayPos(axis) {
            const DISPLAY_CYCLE = symbols.length * STOP_PER_SYMBOL;

            const reelPos =
                (MAX_LENGTH - floor(axis)) % MAX_LENGTH;

            symbols.forEach((symbol, index) => {
                const initialPos = index * STOP_PER_SYMBOL;
                const displayPos = (axis + initialPos) % DISPLAY_CYCLE;

                updateSymbolPos(symbol, displayPos);

                const stop = floor(displayPos);

                if (stop > 0 && stop < DISPLAY_CYCLE) {
                    symbol.readyToChange = true;
                }

                if (symbol.readyToChange && stop === 0) {
                    updateIcon(symbol, reelPos);
                    symbol.readyToChange = false;
                }
            });
        }

        function updateSymbolPos(symbol, pos) {
            symbol.view.y =
                DISPLAY_ORIGIN_POINT + (pos * symbol.stepSize);
            symbol.displayPos = pos;
        }

        function updateIcon(symbol, reelPos) {
            if (symbol === undefined) return;

            const icon = nth(reelPos + DISPLAY_ORIGIN_POS, reelTable);

            symbol.icon = icon;
        }
    }
}

