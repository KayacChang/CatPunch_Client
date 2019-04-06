//  Imports

//  Exports
module.exports = function(api) {
    //  Cache   =====================================
    api.cache(() => process.env.NODE_ENV === 'production');

    //  Presets =====================================
    const env = [
        '@babel/preset-env',
        {
            targets: '> 0.25%, not dead',
            loose: true,
            useBuiltIns: 'entry',
        },
    ];

    const flow = ['@babel/preset-flow'];

    //  Plugins =====================================

    //  Return =====================================
    const presets = [env, flow];
    const plugins = [];
    return {presets, plugins};
};
