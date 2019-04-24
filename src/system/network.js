import axios from 'axios';

const MEDIA_TYPE = {
    TEXT: 'text/plain',
    JSON: 'application/json',
};

const UTF8 = 'charset=utf-8';

export function Network() {
    const proxy = axios.create({
        baseURL: 'http://192.168.1.15:8000',
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

function whenError(err) {
    console.error(`Network error: ${err}`);
}

