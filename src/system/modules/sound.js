import {Howler} from 'howler';
import {loaders} from 'pixi.js';

export function Sound({loader}) {
    function play(name) {
        const sound = loader.resources[name].data;
        sound.play();

        return sound;
    }

    function mute(isMuted) {
        if (isMuted === undefined) return Howler._muted;
        return Howler.mute(isMuted);
    }

    //  From 0.0 to 1.0
    function volume(level) {
        return Howler.volume(level);
    }

    function getBy(predicate) {
        return Object.values(loader.resources)
            .filter(({type}) => type === loaders.Resource.TYPE.AUDIO)
            .filter(predicate);
    }

    return {play, mute, volume, getBy};
}
