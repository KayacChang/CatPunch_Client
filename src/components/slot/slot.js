// import {MotionBlurFilter} from 'pixi-filters';

import anime from 'animejs';
import {divide} from 'mathjs';

export function SlotMachine(view, config) {
    //  Constant
    const {
        SYMBOL_CONFIG,

        REEL_TABLE,

        STOP_PER_SYMBOL,

        SPIN_DURATION,

        TIME_INTERVAL_PER_REEL,
    } = config;

    const SYMBOL_TEXTURES =
        SYMBOL_CONFIG
            .map(({id, name}) =>
                ({id, texture: app.resource.get(name).texture}));

    //  Initialization
    const symbols =
        view.children
            .filter(({name}) => name.includes('symbol'))
            .map(Symbol);

    const reels =
        symbols
            .reduce((arr, symbol) => {
                const reelIdx = symbol.reelIdx;

                if (!arr[reelIdx]) arr[reelIdx] = [];

                arr[reelIdx].push(symbol);

                return arr;
            }, [])
            .map((symbols, index) =>
                Reel(symbols, REEL_TABLE[index]));

    //  3. Return
    return {
        play,
    };

    function getTexture(icon) {
        return SYMBOL_TEXTURES
            .find(({id}) => id === icon)
            .texture;
    }

    function getIcon(_texture) {
        return SYMBOL_TEXTURES
            .find(({texture}) => texture === _texture)
            .id;
    }

    function Symbol(view) {
        const [reelIdx, _colIdx] =
            view.name
                .replace('symbol@', '')
                .split('_')
                .map(Number);

        const colIdx = _colIdx * STOP_PER_SYMBOL;

        /*  displayPos:
            the current symbol's position on the reels */
        let displayPos = colIdx;

        return {
            get reelIdx() {
                return reelIdx;
            },
            get colIdx() {
                return colIdx;
            },
            get displayPos() {
                return displayPos;
            },
            set displayPos(newPos) {
                update(newPos);

                displayPos = newPos;
            },
            get view() {
                return view;
            },
            get icon() {
                return getIcon(view.texture);
            },
            set icon(newIcon) {
                view.texture = getTexture(newIcon);
            },
        };

        //  Update Symbol Position
        function update(newPos) {
            const offsetY = view.anchor.y * view.height;
            const disY = divide(newPos, STOP_PER_SYMBOL) * view.height;

            view.y = disY + offsetY;
        }
    }

    function Reel(symbols, reelTable) {
        /*  reelPos:
            the current reel's position */
        let reelPos = 0;

        init();

        const DISPLAY_CYCLE = symbols.length * STOP_PER_SYMBOL;

        return {
            get reelPos() {
                return reelPos;
            },
            set reelPos(newPos) {
                //  cycle by reelTable
                newPos %= reelTable.length;

                update(newPos);

                reelPos = newPos;
            },
        };

        function init() {
            //  From bottom to top
            symbols
                .slice(0).reverse()
                .forEach((symbol, index) => {
                    const stops = index * STOP_PER_SYMBOL;
                    symbol.icon = reelTable[stops];
                });

            //  Init Reel Positions
            const maxIdx = (symbols.length - 1);
            reelPos = maxIdx * STOP_PER_SYMBOL;
        }

        function update(newPos) {
            symbols
                .forEach((symbol, index) => {
                    const stops = index * STOP_PER_SYMBOL;

                    const offsetPos = symbol.colIdx - stops;
                    const displayPos =
                        (stops + newPos) % DISPLAY_CYCLE
                        + offsetPos;

                    //  Update Symbol Icon
                    if (Math.abs(displayPos - offsetPos) < 0.5) {
                        const iconNum = Math.trunc(newPos);
                        symbol.icon = reelTable[iconNum];
                    }

                    //  Update Symbol Position
                    symbol.displayPos = displayPos;
                });
        }
    }

    function play() {
        reels.map((reel, index) => {
            const spinAnimation = anime({
                targets: reel,
                reelPos: '+=' + 77,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            setTimeout(stop,
                SPIN_DURATION +
                index * TIME_INTERVAL_PER_REEL);

            function stop() {
                spinAnimation.pause();

                reel.reelPos = Math.trunc(reel.reelPos) + 0.2;

                anime({
                    targets: reel,
                    reelPos: Math.trunc(reel.reelPos),
                    easing: 'easeOutElastic(1, .5)',
                    duration: 150,
                });
            }
        });
    }
}
