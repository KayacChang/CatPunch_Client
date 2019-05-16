import Worker from './test.worker.js';

export function Service(network) {
    const it = new Worker();

    return {
        login,
        getUser,
        init,
        getOneRound,
    };

    function login() {
        const body = {
            type: 'login',
        };

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

    function getOneRound(bet) {
        const body = {
            type: 'gameResult',
            token: '',
            playerid: '',
            bet,
            gametypeid: '',
        };

        it.postMessage(body);

        return new Promise((resolve) => {
            it.onmessage = (e) => resolve(e.data);
        });
    }
}

