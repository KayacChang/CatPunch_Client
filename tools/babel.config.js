//  Imports

//  Exports
module.exports = function(api) {
    //  Cache   =====================================
    api.cache(() => process.env.NODE_ENV === 'production');

    //  Presets =====================================
    const env = [
        '@babel/env',
        {
            targets: {
                edge: '17',
                firefox: '60',
                chrome: '67',
                safari: '11.1',
            },
            useBuiltIns: 'usage',
        },
    ];

    const flow = ['@babel/preset-flow'];

    //  Plugins =====================================
    const runtime = '@babel/plugin-transform-runtime';
    const dynamicImport = '@babel/plugin-syntax-dynamic-import';
    const transformFlowStripTypes = 'transform-flow-strip-types';

    //  Return =====================================
    const presets = [env, flow];
    const plugins = [runtime, dynamicImport, transformFlowStripTypes];
    return {presets, plugins};
};
