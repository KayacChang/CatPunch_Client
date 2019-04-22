export function RangeSlider(it) {
    it.interactive = true;

    it.buttonMode = true;

    it
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

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

            const pX = percent(x);

            if (100 > pX && pX > 0) it.x = x;
        }
    }

    function percent(num) {
        const max = it.parent.width - it.width;

        return Math.floor((num / max) * 100);
    }

    return it;
}
