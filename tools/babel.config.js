//  Imports

//  Exports
module.exports = function(api) {
    //  Cache   =====================================
    api.cache(() => process.env.NODE_ENV === 'production');

    //  Presets =====================================
    // const env = [
    //     '@babel/preset-env',
    //     {
    //         targets: '> 1%',
    //         loose: true,
    //         useBuiltIns: 'usage',
    //     },
    // ];

    const flow = ['@babel/preset-flow'];

    //  Plugins =====================================
    const dynamicImport = '@babel/plugin-syntax-dynamic-import';

    //  Return =====================================
    const presets = [flow];
    const plugins = [dynamicImport];
    return {presets, plugins};
};
