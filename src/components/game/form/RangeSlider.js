export function RangeSlider(it) {
    it.interactive = true;

    it.buttonMode = true;

    it
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    const max = it.parent.width - it.width;

    let getPos = undefined;

    function onDragStart(event) {
        getPos = () =>
            event.data.getLocalPosition(it.parent);
    }

    function onDragEnd() {
        getPos = undefined;
    }

    function onDragMove() {
        if (getPos) {
            const {x} = getPos();

            it.x = condition(x);

            it.emit('input', {value: percent(it.x)});
        }
    }

    function condition(x) {
        return (
            (x <= 0) ? 0 :
                (x >= max) ? max :
                    x
        );
    }

    function percent(num) {
        return Math.floor((num / max) * 100);
    }

    return it;
}
