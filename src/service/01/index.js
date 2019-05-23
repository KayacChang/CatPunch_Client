import {getSearchParams} from '../utils';

const {assign, entries, fromEntries} = Object;

export function Service(network) {
    const tokens = {
        'accounttoken': construct(),
        'token': '',
    };

    const user = {
        'gameaccount': '',
        'playerid': '',
    };

    const env = {
        logintype: 3,
        gametypeid: 'A173D52E01A6EB65A5D6EDFB71A8C39C',
    };

    return {login, init, refresh, exchange, checkout, sendOneRound};

    function construct() {
        const token =
            getSearchParams('token') || sessionStorage.getItem('accounttoken');

        if (!token) {
            // @TODO Maybe Popup an Alert before redirect to game hall.

            history.back();

            throw new Error(
                `User Access Tokens is empty. Redirect to Game Hall`,
            );
        }

        history.pushState(undefined, undefined, location.origin);

        global.addEventListener('popstate', () => history.back());

        sessionStorage.setItem('accounttoken', token);

        return token;
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
                    throw error['Msg'];
                }

                tokens.token = data['token'];

                user.gameaccount = data['gameaccount'];

                user.balance = new Map(
                    data['userCoinQuota']
                        .map((data) => [data.type, data]),
                );

                data['gameInfo']
                    .forEach(({type, ...data}) =>
                        assign(user.balance.get(type), data));

                return data;
            })
            .catch((err) => console.error(err));
    }

    function init() {
        const requestBody = {
            ...tokens,
            ...env,
            ...user,
        };

        return network
            .post('lobby/init', requestBody)
            .then(({data, error}) => {
                user.playerid = data['player']['id'];

                return data;
            })
            .catch((err) => console.error(err));
    }

    function refresh() {
        const requestBody = {
            ...tokens,
            ...env,
            ...user,
        };

        return network
            .post('lobby/refresh', requestBody)
            .then(({data, error}) => {
                data['userCoinQuota']
                    .forEach(({type, amount}) => {
                        user.balance.get(type).amount = amount;
                    });
                return data;
            })
            .catch((err) => console.error(err));
    }

    function exchange({type, amount}) {
        const requestBody = {
            ...tokens,
            ...env,
            ...user,

            'cointype': Number(type),
            'coinamount': amount,
        };

        return network
            .post('lobby/exchange', requestBody)
            .then(({data, error}) => {
                user.coin = data['gameCoin'];
                return data;
            })
            .then(refresh)
            .catch((err) => console.error(err));
    }

    function checkout() {
        const requestBody = {
            ...tokens,
            ...env,
            ...user,
        };

        return network
            .post('lobby/checkout', requestBody)
            .then(({data, error}) => {
                user.coin = 0;

                return fromEntries(
                    entries(data['userCoinQuota'])
                        .filter(([key]) => key.includes('coin'))
                        .map(([key, value]) => {
                            const type = key.match(/\d+/g);
                            return [type, value];
                        }),
                );
            })
            .catch((err) => console.error(err));
    }

    function sendOneRound(userBet) {
        const requestBody = {
            ...tokens,
            ...env,
            packet_id: 5,
            Payload: {
                enumOperationType: 2,
                // enumBetBaseType: 0,
                // enumBetMultiply: 0,
                ...userBet,
            },
        };
        return network
            .post('api/entry', requestBody)
            .then(({payload}) => JSON.parse(payload));
    }
}

