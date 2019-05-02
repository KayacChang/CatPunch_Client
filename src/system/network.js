import axios from 'axios';

const MEDIA_TYPE = {
    TEXT: 'text/plain',
    JSON: 'application/json',
};

const UTF8 = 'charset=utf-8';

function whenError(err) {
    console.error(`Network error: ${err}`);
}

export function Network() {
    const proxy = axios.create({
        baseURL: process.env.SERVICE_URL,
        headers: {
            'Content-Type': MEDIA_TYPE.JSON + '; ' + UTF8,
        },
        timeout: 1500,
    });

    function get(url) {
        return proxy
            .get(url)
            .catch(whenError);
    }

    function post(url, data) {
        return proxy
            .post(url, data)
            .catch(whenError);
    }

    return {get, post};
}
