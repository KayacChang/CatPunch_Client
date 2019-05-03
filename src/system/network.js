import axios from 'axios';

const MEDIA_TYPE = {
    TEXT: 'text/plain',
    JSON: 'application/json',
};

const UTF8 = 'charset=utf-8';

export function Network() {
    const proxy = axios.create({
        baseURL: process.env.SERVICE_URL,
        headers: {
            'Content-Type': MEDIA_TYPE.JSON + '; ' + UTF8,
        },
        timeout: 1500,
    });

    function fetchData(promise) {
        return promise.then(({data}) => data);
    }

    function get(url) {
        return fetchData(proxy.get(url));
    }

    function post(url, payload) {
        return fetchData(proxy.post(url, payload));
    }

    return {get, post};
}
