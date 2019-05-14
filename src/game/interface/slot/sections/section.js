export function Section(it) {
    it.open = open;
    return it;

    function open() {
        it.visible = true;
    }
}
