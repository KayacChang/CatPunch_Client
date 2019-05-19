
export function isReel({name}) {
    return name.includes('reel');
}

export function isSymbol({name}) {
    return name.includes('symbol');
}

export function isResult({name}) {
    return name.includes('result');
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


