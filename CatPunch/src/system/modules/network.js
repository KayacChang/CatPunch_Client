import axios from 'axios/index';

const MEDIA_TYPE = {
    TEXT: 'text/plain',
    JSON: 'application/json',
};

const UTF8 = 'charset=utf-8';

export function Network() {
    const proxy = axios.create({
        baseURL: ENV.SERVICE_URL,
        headers: {
            'Content-Type': MEDIA_TYPE.JSON + '; ' + UTF8,
        },
        timeout: 10000,
    });

    function fetchData(promise) {
        return promise.then(({data}) => data);
    }

    function get(url) {
        return fetchData(
            proxy
                .get(url)
                .catch((err) => app.alert.error(err)),
        );
    }

    function post(url, payload) {
        return fetchData(
            proxy
                .post(url, payload)
                .catch((err) => app.alert.error(err)),
        );
    }

    return {get, post};
}
