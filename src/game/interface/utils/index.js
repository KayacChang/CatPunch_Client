export function currencyFormat(num) {
    return new Intl.NumberFormat('en').format(num);
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
