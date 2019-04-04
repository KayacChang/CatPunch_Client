import {
    Container,
    Sprite,
} from 'pixi.js';

import anime from 'animejs';

import {pipe, map} from 'ramda';

const {defineProperty} = Object;

import payTable from './payTable';


/**
 * Mapping id => texture using payTable.
 *
 * @param {number} id
 * @return {PIXI.Texture}
 */
function SymbolTexture(id: number) {
    return app.loader
        .resources[payTable[id].url]
        .texture;
}

/**
 * Abstraction for Slot Symbol.
 * Take specify id to switch Symbol Texture.
 *
 * @param {number} id
 * @return {PIXI.Sprite}
 */
function SlotSymbol(id: number): Sprite {
    const it = new Sprite(SymbolTexture(id));

    it.anchor.set(0.5, 0.5);

    defineProperty(it, 'id', {
        get() {
            return id;
        },
        set(newId) {
            id = newId;

            it.texture = SymbolTexture(id);
        },
    });

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
    const OFFSET_HEIGHT = SYMBOL_HEIGHT / 2;

    const getY =
        (value) => value * SYMBOL_HEIGHT + OFFSET_HEIGHT;

    symbols.map(
        (symbol, index) => symbol.y = getY(index));

    it.addChild(...symbols);

    /*
       reelPos:
       A abstraction concept for Virtual Reel Position.
       Biject to all Symbols position in this reel.
     */

    let reelPos = 0;
    defineProperty(
        it, 'reelPos', {
            get() {
                return reelPos;
            },
            set(newPos) {
                update(newPos);
                reelPos = newPos;
            },
        });

    function update(position) {
        symbols.map((symbol, index) => {
            const displayPos = (index + position) % symbols.length;

            symbol.y = getY(displayPos);
        });
    }

    return it;
}

function SlotMachine(reelTable) {
    const it = new Container();

    const SYMBOL_WIDTH = 160;
    const OFFSET_WIDTH = SYMBOL_WIDTH / 2;

    const getX =
        (value) => value * SYMBOL_WIDTH + OFFSET_WIDTH;

    //  Reels Initialize
    const reels = map(pipe(
        map(SlotSymbol),
        SlotReel,
    ))(reelTable);

    reels.map(
        (reel, index) => reel.x = getX(index));

    it.addChild(...reels);

    window.play = play;

    return it;

    function play() {
        reels.map(function(reel, index) {
            const it = anime({
                targets: reel,
                reelPos: '+=' + 40,
                easing: 'easeInOutQuad',
                duration: 4000,
            });

            setTimeout(function() {
                it.pause();
                anime({
                    targets: reel,
                    reelPos: Math.round(reel.reelPos + 3),
                    easing: 'easeOutElastic(1, .1)',
                });
            }, 2000 + index * 450);
        });
    }
}

export {SlotMachine};
