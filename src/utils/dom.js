const it = document;

export function getElement(queryString) {
    return it.querySelector(queryString);
}

export function getAllElement(queryString) {
    return it.querySelectorAll(queryString);
}

export function remove(element) {
    return element.remove();
}
