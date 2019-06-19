import numeral from 'numeral';

export function currencyFormat(num) {
    return numeral(num).format('$0,0');
}

export function currencyValue(num) {
    return numeral(num).value();
}

export function signFormat(num) {
    return numeral(num).format('+0,0');
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
