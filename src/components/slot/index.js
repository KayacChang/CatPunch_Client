import {map, pipe, isNil, propEq, times} from 'ramda';

import {Container, Sprite} from 'pixi.js';

import {Random, MersenneTwister19937} from 'random-js';

const random = new Random(MersenneTwister19937.autoSeed());

function SlotSymbolFactory(symbols: []) {
    function Texture(id) {
        if (isNil(id)) {
            return random.pick(symbols);
        }

        return symbols
            .find(propEq('id', id))
            .texture;
    }

    function SlotSymbol(id) {
        const it = new Sprite(Texture(id));

        return it;
    }

    return SlotSymbol;
}

function SlotReel(...symbols) {

}


function SlotMachine(data) {
    const it = new Container();

    const SlotSymbol = SlotSymbolFactory(data.symbols);

    //  one reel
    times(SlotSymbol, data.rows);

    data.cols;


    //  Reels Initialize

    reels.map(
        (reel, index) => reel.x = getX(index));

    it.addChild(...reels);

    return it;
}
