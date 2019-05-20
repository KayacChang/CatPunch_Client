
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
    const {textures} = app.resource.get('symbols');

    const mapping =
        symbolConfig
            .map(({id, texture}) =>
                ({id, texture: textures[texture]}));

    return {getTexture};

    function getTexture(iconId) {
        return mapping
            .find(({id}) => id === iconId)
            .texture;
    }
}


