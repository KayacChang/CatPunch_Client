import {Howler} from 'howler';

export function Sound({loader}) {
    function play(name) {
        const sound = loader.resources[name].data;
        sound.play();
    }

    /**
     * Handle muting and unmute globally.
     * @param  {Boolean} muted Is muted or not.
     * @return {Howler}
     */
    function mute(muted) {
        return Howler.mute(muted);
    }

    return {play, mute};
}
