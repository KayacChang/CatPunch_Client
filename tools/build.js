//  Imports
const {table, log} = console;
const {mergeRight} = require('ramda');

//  Exports
module.exports = function(env) {
    log('======Please Check Out Current Environment=========');
    table({
        'Node': process.env.NODE_ENV,
        'Webpack': env.mode,
    });

    env.SERVICE_URL =
        (env.mode === 'development') ?
            'http://192.168.1.14:8000' :
            'http://13.112.112.160:8000';

    log(env);
    log('===================================================');

    const commonConfig = require(`./common.config.js`)(env);

    const environmentConfig = require(`./${env.mode}.config.js`)(env);

    return mergeRight(commonConfig, environmentConfig);
};

