import {floor} from 'mathjs';

export function isReel({name}) {
    return name.includes('reel');
}

export function isSymbol({name}) {
    return name.includes('symbol');
}

export function isResult({name}) {
    return name.includes('result');
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


