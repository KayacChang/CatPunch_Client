//  Imports

//  Exports
module.exports = function(...args) {
    return {
        //  Mode    =========================================
        mode: 'development',

        devServer: {
            compress: true,
            port: 8091,
        },

        //  DevTool =========================================
        devtool: 'inline-source-map',
    };
};
