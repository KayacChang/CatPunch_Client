export function Button(it) {
    it.buttonMode = true;
    it.interactive = true;
    return it;
}

export function ToggleButton(it) {
    it = Button(it);
    it.checked = false;

    it.on('pointerdown', click);

    return it;

    function click() {
        it.checked = !it.checked;
        it.emit('Change', it.checked);
    }
}
