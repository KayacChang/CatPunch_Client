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

    log(env);
    log('===================================================');

    const commonConfig = require(`./common.config.js`)(env);

    const environmentConfig = require(`./${env.mode}.config.js`)(env);

    return mergeRight(commonConfig, environmentConfig);
};

