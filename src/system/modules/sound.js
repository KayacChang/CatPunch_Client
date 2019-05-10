import {Howler} from 'howler';

export function Sound({loader}) {
    Howler.autoUnlock = false;

    function play(name) {
        const sound = loader.resources[name].data;
        sound.play();
    }

    function mute(isMuted) {
        return Howler.mute(isMuted);
    }

    return {play, mute};
}
