//  Imports
const {resolve} = require('path');
const {ProgressPlugin, optimize} = require('webpack');
const {ModuleConcatenationPlugin} = optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CSPHtmlWebpackPlugin = require('csp-html-webpack-plugin');

//  Path
const {
    sourceDir,
    productDir,
    baseDir,
    toolDir,
    publicPath,
} = require('../constant');

//  Exports
module.exports = function(...args) {
    return {
        //  Entry   ===========================================
        entry: resolve(sourceDir, 'main.js'),

        //  Output  ===========================================
        output: {
            path: productDir,
            filename: 'bundle.js',
            publicPath: publicPath,
        },

        //  Optimization    ====================================
        optimization: {
            usedExports: true,
            concatenateModules: true,

            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 1,
            },
        },

        //  Module =============================================
        module: {
            rules: [
                //  JavaScript =============================================
                {
                    test: /\.js$/,
                    include: sourceDir,
                    sideEffects: false,
                    use: [
                        //  PreCompile ===================================
                        {
                            loader: 'babel-loader',
                            options: {
                                configFile: resolve(toolDir, 'babel.config.js'),
                            },
                        },
                        //  Code Quality ===================================
                        {loader: 'eslint-loader'},
                    ],
                },
                //  StyleSheet =============================================
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                //  Assets =============================================
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][hash].[ext]',
                            },
                        },
                    ],
                },
                //  Favicon =============================================
                {
                    test: /\.(ico)$/,
                    use: [
                        {loader: 'url-loader', options: {limit: 8192}},
                    ],
                },
            ],
        },

        //  Plugins ==========================================
        plugins: [
            //  Building Progress
            new ProgressPlugin(),

            //  Module Bundle like Roll up
            new ModuleConcatenationPlugin(),

            //  HTML
            new HtmlWebpackPlugin({
                filename: 'index.html',
                favicon: resolve(baseDir, 'favicon.ico'),
                template: resolve(baseDir, 'index.html'),
                hash: true,
            }),

            new CSPHtmlWebpackPlugin(),
        ],
        //  END ============================================
    };
};
