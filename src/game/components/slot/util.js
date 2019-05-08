import {floor} from 'mathjs';

export function isReel({name}) {
    return name.includes('reel');
}

export function isSymbol({name}) {
    return name.includes('symbol');
}

export function toReelPos(reel, axis) {
    const maxLength = reel.reelTable.length;
    return (maxLength - floor(axis)) % maxLength;
}

export function toAxis(reel, reelPos) {
    const maxLength = reel.reelTable.length;
    return (maxLength - reelPos) % maxLength;
}

export function TextureManager(symbolConfig) {
    const textures =
        symbolConfig
            .map(({id, name}) =>
                ({id, texture: app.resource.get(name).texture}));

    return {getTexture};

    function getTexture(iconId) {
        return textures
            .find(({id}) => id === iconId)
            .texture;
    }
}

export function update(reel, axis) {
    reel.symbols
        .forEach((symbol) => {
            updatePos(symbol);
            updateIcon(symbol);
        });

    function updatePos(symbol) {
        const initialPos = symbol.symbolIdx * symbol.stopPerSymbol;

        symbol.displayPos = (axis + initialPos) % reel.displayLength;

        if (symbol.displayPos >= reel.displayLength - 1) {
            symbol.readyToChange = true;
        }
    }

    function updateIcon(symbol) {
        if (symbol.readyToChange && symbol.displayPos < 1) {
            symbol.icon = reel.reelTable[reel.reelPos];
            symbol.readyToChange = false;
        }
    }
}
