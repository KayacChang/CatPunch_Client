const {defineProperty} = Object;

export function MuteButton(it) {
    let muted = false;

    defineProperty(it, 'muted', {
        get() {
            return muted;
        },
        set(flag) {
            muted = flag;
            app.sound.mute(muted);
        },
    });

    it.on('pointerdown', () => {
        it.muted = !it.muted;
    });

    return it;
}
