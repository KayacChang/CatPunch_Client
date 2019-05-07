export function isReel({name}) {
    return name.includes('reel');
}

export function isSymbol({name}) {
    return name.includes('symbol');
}

export function toReelPos(reelTable, axis) {
    const maxLength = reelTable.length;
    return (maxLength - floor(axis)) % maxLength;
}

export function toAxis(reelTable, reelPos) {
    const maxLength = reelTable.length;
    return (maxLength - reelPos) % maxLength;
}

export function TextureManager(symbolConfig) {
    const SYMBOL_TEXTURES =
        symbolConfig
            .map(({id, name}) =>
                ({id, texture: app.resource.get(name).texture}));

    return {getTexture};

    function getTexture(id) {
        return SYMBOL_TEXTURES
            .find(({id}) => id === icon)
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
    }

    function updateIcon(symbol) {
        if (symbol.readyToChange && symbol.displayPos === 0) {
            symbol.icon = reel.reelTable[reel.reelPos];
        }
    }
}
