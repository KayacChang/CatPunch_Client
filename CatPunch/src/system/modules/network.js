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

    async function get(url) {
        try {
            const {data} = await proxy.get(url);

            return data;
        } catch (err) {
            app.alert.error(err);
        }
    }

    async function post(url, payload) {
        try {
            const {data} = await proxy.post(url, payload);

            return data;
        } catch (err) {
            app.alert.error(err);
        }
    }

    return {get, post};
}
