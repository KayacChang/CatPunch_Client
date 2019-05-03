function fetchTokenFromURL() {
    const url = new URL(location);

    return url.searchParams.get('token');
}

export function Service(network) {
    const token =
        fetchTokenFromURL() || sessionStorage.getItem('token');

    if (!token) {
        // @TODO Maybe Popup an Alert before redirect to game hall.

        history.back();

        throw new Error(`User Access Tokens is empty. Redirect to Game Hall`);
    }

    history.pushState(undefined, undefined, location.origin);

    global.addEventListener('popstate', () => history.back());

    sessionStorage.setItem('token', token);

    return {sendLogin};

    function sendLogin() {
        const payLoad = {
            token,
            sso_token: '',
            agent_id: 0,
            game_id: 5,
            packet_id: 0,
            Payload: '',
        };

        return network
            .post('api/entry', payLoad)
            .then(({payload}) => JSON.parse(payload));
    }
}

