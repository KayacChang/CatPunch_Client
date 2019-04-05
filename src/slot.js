import {
    Container,
    Sprite,
} from 'pixi.js';

import anime from 'animejs';

import {pipe, map, addIndex} from 'ramda';

const mapIndexed = addIndex(map);

const {defineProperties} = Object;

import payTable from './payTable';

/**
 * Mapping id => texture using payTable.
 *
 * @param {number} icon
 * @return {PIXI.Texture}
 */
function SymbolTexture(icon: number) {
    return app.loader
        .resources[payTable[icon].url]
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
    const it = new Sprite(SymbolTexture(icon));

    it.anchor.set(0.5, 0.5);

    defineProperties(it, {
        icon: {
            get() {
                return icon;
            },
            set(newIcon) {
                icon = newIcon;
                it.texture = SymbolTexture(icon);
            },
        },
    });

    it.setY = (newY) => {
        it.y = newY;
    };

    return it;
}

/**
 * Abstraction for Slot Reel.
 *
 * @param {Sprite[]} symbols
 * @return {PIXI.Container|number}
 */
function SlotReel(symbols = []) {
    const it = new Container();

    const SYMBOL_HEIGHT = 160;
    const OFFSET_HEIGHT = SYMBOL_HEIGHT / 2 - SYMBOL_HEIGHT;

    const getY =
        (value) => value * SYMBOL_HEIGHT + OFFSET_HEIGHT;

    it.symbols = symbols;

    symbols.map(
        (symbol, index) => {
            symbol.setY(getY(index));
        });

    it.addChild(...symbols);

    /*
       reelPos:
       A abstraction concept for Virtual Reel Position.
       Biject to all Symbols position in this reel.
     */

    let reelPos = 0;
    defineProperties(it, {
        reelPos: {
            get() {
                return reelPos;
            },
            set(newPos) {
                reelPos = newPos;
                update(reelPos);
            },
        },
    });

    function update(position) {
        symbols.map((symbol, index) => {
            const displayPos = (index + position) % symbols.length;

            symbol.setY(getY(displayPos));

            if (Math.trunc(displayPos) === 0) {
                symbol.emit('ReadyToChange');
            }
        });
    }

    return it;
}

function getRamdonInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function SlotMachine(reelTable) {
    const it = new Container();

    const SYMBOL_WIDTH = 160;
    const OFFSET_WIDTH = SYMBOL_WIDTH / 2;

    const getX =
        (value) => value * SYMBOL_WIDTH + OFFSET_WIDTH;

    //  Reels Initialize
    const reels = map(pipe(
        mapIndexed((icon, index) => {
            const symbol = SlotSymbol(icon);

            return symbol;
        }),
        SlotReel,
    ))(reelTable);

    reels.map(
        (reel, index) => reel.x = getX(index));

    it.addChild(...reels);

    window.play = play;

    return it;

    function play(result) {
        reels.map(function(reel, index) {
            const it = anime({
                targets: reel,
                reelPos: '+=' + 50,
                easing: 'easeInOutQuad',
                duration: 5000,
            });

            setTimeout(function() {
                let counter = (reel.symbols.length - 1);

                reel.symbols
                    .map((symbol) => {
                        symbol.once('ReadyToChange', function() {
                            counter--;

                            const icon = result[index][counter];

                            symbol.icon = (icon === undefined) ?
                                getRamdonInt(payTable.length) : icon;

                            if (counter === -1) stop();
                        });
                    });
            }, 2000 + index * 450);

            function stop() {
                it.pause();

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

export {SlotMachine};
