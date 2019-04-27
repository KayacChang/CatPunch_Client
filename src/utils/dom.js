const it = document;

export function getElement(queryString) {
    return it.querySelector(queryString);
}

export function getAllElements(queryString) {
    return it.querySelectorAll(queryString);
}

export function removeElement(element) {
    return element.remove();
}

export function createElement(tag) {
    return it.createElement(tag);
}

export function print(msg) {
    const log = createElement('p');
    log.textContent = msg;
    getElement('#dev-tool').append(log);
}

export function render(target, comp) {
    comp.appendChild(target);
}

export function addClass(target, className) {
    target.classList.add(className);
}

export function removeClass(target, className) {
    target.classList.remove(className);
}
