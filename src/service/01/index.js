import {getSearchParams} from '../utils';
import {clone} from 'ramda';

const {entries, fromEntries} = Object;

export function Service(network) {
    const tokens = {
        'accounttoken': construct(),
        'token': '',
    };

    const env = {
        'logintype': 3,
        'gametypeid': 'A173D52E01A6EB65A5D6EDFB71A8C39C',
    };

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

    return {
        login, init, refresh, exchange, checkout, sendOneRound,

        get currencies() {
            return currencies;
        },

        get accountBalance() {
            return clone(accountBalance);
        },
    };

    function construct() {
        const token =
            getSearchParams('token') || sessionStorage.getItem('accounttoken');

        if (!token) {
            // @TODO Maybe Popup an Alert before redirect to game hall.

            history.back();

            throw new Error(`User Access Tokens is empty`);
        }

        history.pushState(undefined, undefined, location.origin);

        global.addEventListener('popstate', () => history.back());

        sessionStorage.setItem('accounttoken', token);

        return token;
    }

    function updateAccount(data) {
        data.forEach(({type, amount}) => {
            if (!currencies.has(type)) return;
            const currency = currencies.get(type).name;

            accountBalance[currency] = amount;
        });

        return accountBalance;
    }

    function login() {
        const requestBody = {
            ...tokens,
            ...env,
        };

        return network
            .post('account/login', requestBody)
            .then(({data, error}) => {
                if (error['ErrorCode'] !== 0) {
                    throw new Error(error['Msg']);
                }

                tokens.token = data['token'];

                app.user.account = data['gameaccount'];

                updateAccount(data['userCoinQuota']);

                data['gameInfo']
                    .forEach(({type, rate}) => {
                        currencies.get(type).rate = rate;
                    });

                return data;
            });
    }

    function init() {
        const requestBody = {
            ...tokens,
            ...env,
            'gameaccount': app.user.account,
        };

        return network
            .post('lobby/init', requestBody)
            .then(({data, error}) => {
                if (error['ErrorCode'] !== 0) {
                    throw new Error(error['Msg']);
                }

                app.user.cash = data['player']['money'];

                app.user.id = Number(data['player']['id']);

                return data;
            })
            .catch((err) => console.error(err));
    }

    function refresh() {
        const requestBody = {
            ...tokens,
            ...env,
            'gameaccount': app.user.account,
        };

        return network
            .post('lobby/refresh', requestBody)
            .then(({data, error}) => {
                if (error['ErrorCode'] !== 0) {
                    throw new Error(error['Msg']);
                }

                updateAccount(data['userCoinQuota']);

                return accountBalance;
            })
            .catch((err) => console.error(err));
    }

    function exchange({currency, amount}) {
        const requestBody = {
            ...tokens,
            ...env,
            'playerid': app.user.id,
            'cointype': currency,
            'coinamount': amount,
        };

        return network
            .post('lobby/exchange', requestBody)
            .then(({data, error}) => {
                if (error['ErrorCode'] !== 0) {
                    throw new Error(error['Msg']);
                }

                app.user.cash = data['gameCoin'];
                app.emit('UserStatusChange', app.user);
            })
            .then(refresh)
            .then(() => ({accountBalance, cash: app.user.cash}))
            .catch((err) => console.error(err));
    }

    function checkout() {
        const requestBody = {
            ...tokens,
            ...env,
            'playerid': app.user.id,
        };

        return network
            .post('lobby/checkout', requestBody)
            .then(({data, error}) => {
                if (error['ErrorCode'] !== 0) {
                    throw new Error(error['Msg']);
                }

                app.user.cash = 0;

                return fromEntries(
                    entries(data['userCoinQuota'])
                        .filter(([key]) => key.includes('coin'))
                        .map(([key, value]) => {
                            const type = Number(key.match(/\d+/g));
                            return [type, value];
                        }),
                );
            })
            .catch((err) => console.error(err));
    }

    function sendOneRound() {
        const requestBody = {};
        return network
            .post('api/entry', requestBody)
            .then(({payload}) => JSON.parse(payload));
    }
}

