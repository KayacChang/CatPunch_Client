import {getSearchParam} from '../utils';
import {clone} from '../../general';
import {User} from '../user';

const {assign, entries, fromEntries} = Object;

export function Service() {
    const tokens = {
        'accounttoken': construct(),
        'token': '',
    };

    const env = {
        'logintype': ENV.LOGIN_TYPE,
        'gametypeid': ENV.GAME_ID,
    };

    // type 1 - 金幣      gold
    // type 2 - 禮卷      gift
    // type 3 - 娛樂幣    etc
    // type 4 - 紅利      bonus
    const currencies = new Map([
        ['1', {type: '1', name: 'gold', rate: 1}],
        ['3', {type: '3', name: 'etc', rate: 1}],
        ['4', {type: '4', name: 'bonus', rate: 0.5}],
        ['2', {type: '2', name: 'gift', rate: 0.5}],
    ]);
    const accountBalance = {};

    const reelTables = {};

    const order = {
        'cointype': 0,
        'coinamount': 0,
    };

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
            getSearchParam('token') || sessionStorage.getItem('accounttoken');

        if (!token) {
            // @TODO Maybe Popup an Alert before redirect to game hall.

            throw new Error(`User Access Tokens is empty`);
        }

        history.pushState(undefined, undefined,
            location.origin + location.pathname,
        );

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

    function request(url, body) {
        return app.network
            .post(url, body)
            .then(({data, error}) => {
                const code = error['ErrorCode'];
                if (code !== 0) {
                    console.error(new Error(error['Msg']));

                    const msg = {title: `Error: ${code}`};

                    if (code === 18) {
                        msg.text = translate('common:error.maintain');
                    }

                    return app.alert.error(msg);
                }

                return data;
            });
    }

    function login() {
        const requestBody = {
            ...tokens,
            ...env,
        };

        return request('account/login', requestBody)
            .then((data) => {
                tokens.token = data['token'];

                app.user = new User();

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

        return request('lobby/init', requestBody)
            .then((data) => {
                app.user.id = Number(data['player']['id']);

                app.user.cash = data['player']['money'];

                app.user.betOptions = data['betrate']['betrate'];
                app.user.betOptionsHotKey = data['betrate']['betratelinkindex'];
                app.user.bet = data['betrate']['betratedefaultindex'];

                assign(reelTables, {
                    normalTable: data['reel']['normalreel'],
                    freeGameTable: data['reel']['freereel'],
                });

                return {...reelTables};
            });
    }

    function refresh() {
        const requestBody = {
            ...tokens,
            ...env,
            'gameaccount': app.user.account,
        };

        return request('lobby/refresh', requestBody)
            .then((data) => {
                updateAccount(data['userCoinQuota']);

                return accountBalance;
            });
    }

    function exchange({currency, amount}) {
        order['cointype'] = Number(currency);
        order['coinamount'] = Number(amount);

        const requestBody = {
            ...tokens,
            ...env,
            'playerid': app.user.id,

            ...(order),
        };

        return request('lobby/exchange', requestBody)
            .then((data) => {
                app.user.cash = data['gameCoin'];
                app.emit('UserStatusChange', app.user);
            })
            .then(refresh)
            .then(() => ({accountBalance, cash: app.user.cash}));
    }

    function checkout() {
        const requestBody = {
            ...tokens,
            ...env,
            'playerid': app.user.id,
        };

        return request('lobby/checkout', requestBody)
            .then((data) => {
                app.user.cash = 0;

                const result =
                    entries(data['userCoinQuota'])
                        .filter(([key]) => key.includes('coin'))
                        .map(([key, value]) => {
                            const type = key.match(/\d+/)[0];
                            const {name} = currencies.get(type);

                            if (order['cointype'] === Number(type)) {
                                value -= order['coinamount'];
                            }

                            return [name, value];
                        });

                return fromEntries(result);
            });
    }

    function sendOneRound(data) {
        const requestBody = {
            'type': 'gameResult',
            'playerid': app.user.id,
            ...tokens,
            ...env,
            ...data,
        };

        return request('game/gameresult', requestBody)
            .then(handle);
    }

    function handle(data) {
        const totalWin = data['totalwinscore'];
        const cash = data['playermoney'];

        const hasReSpin = Boolean(data['isrespin']);
        const hasFreeGame = Boolean(data['isfreegame']);

        const earnPoints = data['freecount'];

        const normalGame = Result(data['normalresult']);

        const reSpinGame = hasReSpin && Result(data['respin']);

        if (hasReSpin) {
            const {positions, symbols} = clone(normalGame);

            positions[1] = reSpinGame.positions[0];

            symbols[1] = reSpinGame.symbols[0];

            reSpinGame.positions = positions;
            reSpinGame.symbols = symbols;
        }

        const freeGame = hasFreeGame && data['freegame'].map(Result);

        return {
            cash,
            totalWin,
            earnPoints,

            normalGame,

            hasReSpin,
            reSpinGame,

            hasFreeGame,
            freeGame,
        };
    }

    function Result(data) {
        return {
            hasLink: Boolean(data['islink']),
            scores: data['scores'],
            positions: data['plateindex'],
            symbols: data['plate'],
        };
    }
}

