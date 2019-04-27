/*
    **Important**
    Make sure you have already setup the workbox-webpack-plugin.
 */
const {log, error} = console;
const {serviceWorker} = navigator;

if (serviceWorker) {
    window.addEventListener('Load.scss', onload);

    function onload() {
        serviceWorker
            .register('/service-worker.js')
            .then((register) => {
                log('SW registered: ', register);
                // @TODO...
            })
            .catch((err) => {
                error('SW registration failed: ', err);
                // @TODO...
            });
    }
}
