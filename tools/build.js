//  Imports
const {table, log} = console;
const {mergeRight} = require('ramda');
const {
    devServerURL, prodServerURL,
    gameID, loginType,
} = require('../constant');
//  Exports
module.exports = function(env) {
    log('======Please Check Out Current Environment=========');
    table({
        'Node': process.env.NODE_ENV,
        'Webpack': env.mode,
    });

    env.GAME_ID = gameID;
    env.LOGIN_TYPE = loginType;

    env.SERVICE_URL =
        (env.mode === 'development') ?
            devServerURL : prodServerURL;

    log(env);
    log('===================================================');

    const commonConfig = require(`./common.config.js`)(env);

    const environmentConfig = require(`./${env.mode}.config.js`)(env);

    return mergeRight(commonConfig, environmentConfig);
};

