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

export function print(msg) {
    const log = document.createElement('p');
    log.textContent = msg;
    getElement('#dev-tool').append(log);
}
