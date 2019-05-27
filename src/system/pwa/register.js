
const {log, error} = console;
const {serviceWorker} = navigator;

if (serviceWorker) {
    window.addEventListener('load', onload);

    function onload() {
        serviceWorker
            .register('/service-test0.worker.js')
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
