import {clone} from 'ramda';
import {User} from './user';

export function Service(network) {
    // type 1 - 金幣      gold
    // type 2 - 禮卷      gift
    // type 3 - 娛樂幣    etc
    // type 4 - 紅利      bonus
    const currencies = new Map([
        ['1', {type: '1', name: 'gold', rate: 1}],
        ['2', {type: '2', name: 'gift', rate: 0.5}],
        ['3', {type: '3', name: 'etc', rate: 1}],
        ['4', {type: '4', name: 'bonus', rate: 0.5}],
    ]);
    const accountBalance = {};

    const it = new Worker(
        '../worker/test0.worker.js', {type: 'module'},
    );

    return {
        login,
        getUser,
        init,
        getOneRound,

        get currencies() {
            return currencies;
        },

        get accountBalance() {
            return clone(accountBalance);
        },
    };

    function login() {
        const body = {
            type: 'login',
        };

        app.user = new User();

        it.postMessage(body);

        return new Promise((resolve) => {
            it.onmessage = (e) => resolve(e.data);
        });
    }

    function getUser() {
        const body = {
            type: 'getUser',
        };

        it.postMessage(body);

        return new Promise((resolve) => {
            it.onmessage = (e) => resolve(e.data);
        });
    }

    function init() {
        const body = {
            type: 'init',
        };

        it.postMessage(body);

        return new Promise((resolve) => {
            it.onmessage = (e) => resolve(e.data);
        });
    }

    function getOneRound(data) {
        const body = {
            type: 'gameResult',
            token: '',
            playerid: '',
            gametypeid: '',
            ...data,
        };

        it.postMessage(body);

        return new Promise((resolve) => {
            it.onmessage = (e) => resolve(e.data);
        });
    }
}

