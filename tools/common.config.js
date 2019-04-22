//  Imports
const {resolve} = require('path');
const {ProgressPlugin, optimize} = require('webpack');
const {ModuleConcatenationPlugin} = optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CSPHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

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
        entry: [
            resolve(sourceDir, 'system/app.js'),
        ],

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
                minSize: 0,
                maxInitialRequests: Infinity,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName =
                                module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                                )[1];

                            return `${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
        },

        //  Module =============================================
        module: {
            rules: [
                //  JavaScript =============================================
                {
                    test: /\.js$/,
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
                        {loader: MiniCssExtractPlugin.loader},
                        'css-loader',
                    ],
                },
                //  Assets =============================================
                {
                    test: /\.(fui)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash].[ext]',
                                publicPath: 'assets',
                                outputPath: 'assets',
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash].[ext]',
                                publicPath: 'assets',
                                outputPath: 'assets',
                            },
                        },
                    ],
                },
                {
                    test: /\.(wav)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash].[ext]',
                                publicPath: 'assets',
                                outputPath: 'assets',
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

            //  StyleSheets
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),

            new CSPHtmlWebpackPlugin(),

            //  Service Worker
            // new WorkboxPlugin.GenerateSW({
            //     clientsClaim: true,
            //     skipWaiting: true,
            // }),
        ],
        //  END ============================================
    };
};
