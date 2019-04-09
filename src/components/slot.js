import {map, prop, isNil, propEq} from 'ramda';

import {Container, Sprite, Graphics} from 'pixi.js';
import {MotionBlurFilter} from 'pixi-filters';

import {Random, MersenneTwister19937} from 'random-js';
import {getResource} from '../utils/resource';

import anime from 'animejs';

const random = new Random(MersenneTwister19937.autoSeed());

export function Slot(config) {
    //  Data Preprocess
    const symbolTextures = map((
        {id, name}) => ({id, texture: getResource(name).texture}),
    )(config.symbols);

    const reels = [];

    for (let col = 0; col < config.cols; col++) {
        const reel = [];
        for (let row = 0; row < config.rows + 1; row++) {
            reel.push(SlotSymbol());
        }
        reels.push(SlotReel(reel, config.reelTable[col]));
    }
    return SlotMachine(reels);

    function SymbolTexture(icon) {
        return symbolTextures
            .find(propEq('id', icon))
            .texture;
    }

    /**
     * Abstraction for Slot Symbol.
     * Take specify id to switch Symbol Texture.
     *
     * @param {number} icon
     * @return {PIXI.Sprite}
     */
    function SlotSymbol(icon: number): Sprite {
        if (isNil(icon)) icon = random.integer(0, symbolTextures.length - 1);

        const view = new Sprite(SymbolTexture(icon));

        view.anchor.set(0.5, 0.5);

        return {
            get view() {
                return view;
            },
            get icon() {
                return icon;
            },
            set icon(newIcon) {
                icon = newIcon;
                view.texture = SymbolTexture(icon);
            },
            get y() {
                return view.y;
            },
            set y(newY) {
                view.y = newY;
            },
        };
    }

    function SlotReel(symbols = [], reelTable = []) {
        const view = new Container();

        const SYMBOL_HEIGHT = config.symbolHeight;
        const OFFSET_HEIGHT = SYMBOL_HEIGHT / 2 - SYMBOL_HEIGHT;

        const position =
            (value) => (value * SYMBOL_HEIGHT) + OFFSET_HEIGHT;

        symbols.map((symbol, index) => symbol.y = position(index));

        const motionBlur = new MotionBlurFilter();
        view.filters = [motionBlur];

        view.addChild(...(symbols.map(prop('view'))));

        /*  reelPos:
            Virtual Reel Position.
            map to all Symbols position in this reel.  */
        let reelPos = 0;

        return {
            get symbols() {
                return symbols;
            },
            get view() {
                return view;
            },
            get reelPos() {
                return reelPos;
            },
            set reelPos(newPos) {
                update(newPos);
                reelPos = newPos;
            },
            get x() {
                return view.x;
            },
            set x(newX) {
                view.x = newX;
            },
        };

        function update(pos) {
            const blurAmount = Math.max(0, (pos - reelPos) * 100);
            motionBlur.velocity = [0, blurAmount];
            motionBlur.kernelSize = blurAmount;

            symbols.map((symbol, index) => {
                const displayPos = (index + pos) % symbols.length;

                symbol.y = position(displayPos);
            });
        }
    }

    function SlotMachine(reels) {
        const view = new Container();

        const SYMBOL_WIDTH = config.symbolWidth;
        const OFFSET_WIDTH = SYMBOL_WIDTH / 2;

        const position =
            (value) => (value * SYMBOL_WIDTH) + OFFSET_WIDTH;

        reels.map((reel, index) => reel.x = position(index));

        view.addChild(...(reels.map(prop('view'))));

        view.position.set(config.x, config.y);

        const mask = new Graphics();
        mask.beginFill();
        mask.drawRect(
            config.x, config.y,
            config.width, config.symbolHeight * 3.75,
        );

        view.mask = mask;

        view.width = config.width;
        view.height = config.height;

        return {
            get view() {
                return view;
            },
            play,
        };
    }

    function play() {
        reels.map(function(reel, index) {
            const spinAnimation = anime({
                targets: reel,
                reelPos: '+=' + 50,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            setTimeout(() => {
                stop();
            }, 2000 + index * 450);

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
