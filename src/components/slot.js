// import {MotionBlurFilter} from 'pixi-filters';

import {getResource} from '../utils/resource';

import anime from 'animejs';

export function SlotMachine(view, config) {
    //  1. Get Symbol Textures
    const symbolTextures =
        config.symbolConfig
            .map(({id, name}) => {
                const {texture} = getResource(name);
                return {id, texture};
            });

    //  2. Init
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
                Reel(symbols, config.reelTable[index]));

    //  3. Return
    return {
        play,
    };

    function getTexture(icon) {
        return symbolTextures
            .find((symbol) => symbol.id === icon)
            .texture;
    }

    function getIcon(texture) {
        return symbolTextures
            .find((symbol) => symbol.texture === texture)
            .id;
    }

    function Symbol(view) {
        const [reelIdx, colIdx] =
            view.name
                .split('@')[1]
                .split('_')
                .map(Number);

        return {
            get name() {
                return view.name;
            },
            get reelIdx() {
                return reelIdx;
            },
            get colIdx() {
                return colIdx;
            },
            get width() {
                return view.width;
            },
            get height() {
                return view.height;
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
            get y() {
                return view.y;
            },
            set y(newY) {
                view.y = newY;
            },
        };
    }

    function Reel(symbols = [], reelTable) {
        symbols
            .forEach((symbol, index) => symbol.icon = reelTable[index]);

        /*  reelPos:
            Virtual Reel Position.
            map to all Symbols position in this reel.  */
        let reelPos = 0;

        return {
            get symbols() {
                return symbols;
            },
            get reelPos() {
                return reelPos;
            },
            set reelPos(newPos) {
                newPos %= reelTable.length;

                update(newPos);

                reelPos = newPos;
            },
        };

        function update(newPos) {
            symbols
                .forEach((symbol, index) => {
                    const offsetPos = symbol.colIdx - index;
                    const displayPos =
                        (index + newPos) % symbols.length + offsetPos;

                    if (displayPos < 0) {
                        const iconNum =
                            Math.trunc(newPos + symbols.length - 1)
                            % reelTable.length;

                        symbol.icon = reelTable[iconNum];
                    }

                    symbol.y = displayPos * symbol.height;
                });
        }
    }

    function play() {
        reels.map(function(reel, index) {
            const spinAnimation = anime({
                targets: reel,
                reelPos: '+=' + 50,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            setTimeout(stop, 2000 + index * 450);

            function stop() {
                spinAnimation.pause();

                anime({
                    targets: reel,
                    reelPos: Math.trunc(reel.reelPos),
                    easing: 'easeOutBack',
                    duration: 250,
                });
            }
        });
    }
}
