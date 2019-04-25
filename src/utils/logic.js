export function where(element) {
    function isIn(set) {
        return set.includes(element);
    }

    function isNotIn(set) {
        return !isIn(set);
    }

    return {isIn, isNotIn};
}
