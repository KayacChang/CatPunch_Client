import {Random, MersenneTwister19937} from 'random-js';
import {
    intersperse, all, equals, filter,
    includes, range, __, head, reject, any,
} from 'ramda';

const normalTable = [
    // eslint-disable-next-line max-len
    '8,5,0,9,8,5,6,8,5,7,0,5,6,8,5,9,8,5,10,0,10,6,5,9,8,6,9,7,5,8,10,9,7,8,9,6,5,8,9,7,9,0,9,6,7,9,8,7,6,5,8,6,7,9,8,9,7,5,8,9,5,9,8,5,7,9,8,9,0,7,5,7,10,5,8,7,9,8,7,5,10,8,9,10,7,5,9,8,6,9,5,6',
    // eslint-disable-next-line max-len
    '8,6,9,0,5,9,7,1,8,6,9,6,7,9,5,8,10,1,6,9,10,7,5,7,8,6,5,9,8,6,7,5,8,9,6,5,8,5,6,7,9,0,7,8,7,9,8,7,1,9,8,6,7,9,8,6,1,8,6,9,8,6,8,10,7,6,8,10,9,6,7,10,7,5,1,9,10,8,9,7,8,9,10,1,10,5,10,1,7,8,5,9',
    // eslint-disable-next-line max-len
    '6,0,8,6,9,5,8,9,5,10,0,8,5,9,7,8,9,5,8,6,8,5,9,6,5,9,8,5,10,7,9,10,5,6,9,8,7,9,7,8,6,7,8,5,7,5,10,8,7,6,9,8,5,9,7,6,7,6,0,10,8,7,10,6,7,10,0,9,5,6,7,8,9,5,10,6,10,9,7,6,9,10,7,5,10,6,5,9,10,5,8,9',
].map(preprocess);

const freeGameTable = [
    // eslint-disable-next-line max-len
    '8,7,0,10,9,5,6,8,6,10,0,9,6,8,5,9,8,9,7,9,5,6,7,9,8,6,9,7,5,8,9,8,7,8,9,6,10,9,7,9,5,9,7,6,7,9,8,0,6,5,8,6,7,9,8,9,7,9,7,9,7,9,8,9,7,8,7,9,10,0,5,7,10,5,8,7',
    // eslint-disable-next-line max-len
    '1',
    // eslint-disable-next-line max-len
    '8,9,8,6,9,5,6,7,9,10,0,10,6,9,5,8,9,5,8,6,10,0,10,8,7,9,8,6,7,9,10,8,6,8,9,8,7,9,7,8,6,7,8,6,9,8,7,8,7,6,9,8,7,9,7,6,7,10,6,8,9,7,9,6,10,8,10,9,5,6,7,8,9,5,10,6',
].map(preprocess);

function preprocess(str) {
    let reel = str
        .split(/,/g)
        .map(Number)
        .filter((icon) => icon !== 10);
    reel = intersperse(10, reel);
    reel.push(10);
    return reel;
}

const random = new Random(
    MersenneTwister19937.autoSeed(),
);

addEventListener('message', ({data}) => {
    const func = {
        'login': () => onLogin(),
        'init': () => onInit(),
        'getUser': () => getUser(),
        'gameResult': () => onGameResult(data),
    }[data.type];

    if (func) {
        return postMessage(func());
    }
});

function onLogin() {
    return 'Service login successful...';
}

function onInit() {
    return {
        normalTable,
        freeGameTable,
    };
}

function getUser() {
    return {};
}

let earnPoints = 0;

function onGameResult({bet, baseGame}) {
    baseGame = baseGame || spin(normalTable);

    const hasLink = checkHasLink(baseGame.symbols);

    if (hasBonusSymbol(baseGame.symbols)) earnPoints += 1;

    const freeGame = (earnPoints === 10) && spinFreeGame();
    const hasFreeGame = !!(freeGame);
    const hasReSpin = checkHasReSpin(baseGame.symbols);

    const result = {
        hasLink, hasFreeGame, hasReSpin,
        earnPoints,
        baseGame, freeGame,
    };

    if (hasFreeGame) earnPoints = 0;

    return result;
}

function spin(table) {
    const positions =
        table.map((reel) =>
            random.integer(0, reel.length - 1));

    const symbols =
        positions
            .map((pos, index) => table[index][pos]);

    return {positions, symbols};
}

function spinFreeGame() {
    const multiply = range(1, 6);

    const results = multiply.map(() => spin(freeGameTable));
    const eachPositions = results.map(({positions}) => positions);
    const eachSymbols = results.map(({symbols}) => symbols);

    const hasLinks = eachSymbols.map(checkHasLink);

    return {multiply, eachPositions, eachSymbols, hasLinks};
}

function hasBonusSymbol(symbols) {
    return symbols[1] === 1;
}

function checkHasLink(symbols) {
    const wildSet = range(0, 4 + 1);

    const isWild = includes(__, wildSet);
    const isEmpty = equals(10);

    if (any(isEmpty, symbols)) return false;

    if (filter(isWild, symbols).length >= 2) return true;

    if (filter(isWild, symbols).length >= 1) {
        const lastSymbol = reject(isWild, symbols);

        return all(equals(head(lastSymbol)), lastSymbol);
    }

    return all(equals(head(symbols)), symbols);
}

function checkHasReSpin(symbols) {
    const isEmpty = equals(10);
    const isWild0 = equals(0);
    const isWild1 = equals(1);

    if (isEmpty(symbols[0])) return false;

    return isWild0(symbols[1]) && isWild1(symbols[2]);
}
