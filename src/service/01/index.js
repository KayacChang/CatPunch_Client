function fetchTokenFromURL() {
    const url = new URL(location);

    return url.searchParams.get('token');
}

export function Service(network) {
    const tokens = {
        'token': construct(),
        'sso_token': '',
    };

    const env = {
        agent_id: 0,
        game_id: 5,
    };

    return {sendLogin, sendInit, sendOneRound};

    function construct() {
        const token =
            fetchTokenFromURL() || sessionStorage.getItem('token');

        if (!token) {
            // @TODO Maybe Popup an Alert before redirect to game hall.

            history.back();

            throw new Error(
                `User Access Tokens is empty. Redirect to Game Hall`,
            );
        }

        history.pushState(undefined, undefined, location.origin);

        global.addEventListener('popstate', () => history.back());

        sessionStorage.setItem('token', token);

        return token;
    }

    function sendLogin() {
        const requestBody = {
            ...tokens,
            ...env,
            packet_id: 0,
            Payload: '',
        };

        return network
            .post('api/entry', requestBody)
            .then(({payload}) => JSON.parse(payload))
            .then((result) => {
                tokens['sso_token'] = result['sso_token'];
                return result;
            });
    }

    function sendInit() {
        const requestBody = {
            ...tokens,
            ...env,
            packet_id: 4,
            Payload: '',
        };

        return network
            .post('api/entry', requestBody)
            .then(({payload}) => JSON.parse(payload));
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

