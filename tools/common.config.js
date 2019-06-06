//  Imports
const {resolve} = require('path');
const {ProgressPlugin, DefinePlugin, optimize} = require('webpack');
const {ModuleConcatenationPlugin} = optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkerPlugin = require('worker-plugin');

//  Path
const {
    sourceDir,
    productDir,
    baseDir,
    toolDir,
    publicPath,
} = require('../constant');

//  Exports
module.exports = function(env) {
    env = {...env, SERVICE_URL: 'http://192.168.1.14:8000'};

    return {
        //  Entry   ===========================================
        entry: [
            resolve(sourceDir, 'main.js'),
        ],

        //  Output  ===========================================
        output: {
            path: productDir,
            filename: 'js/bundle.js',
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
                    test: /\.(css|scss)$/,
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        'css-loader',
                        'sass-loader',
                    ],
                },
                // Assets =============================================
                {
                    type: 'javascript/auto',
                    test: /\.json$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                publicPath: publicPath + 'assets',
                                outputPath: 'assets',
                            },
                        },
                    ],
                },
                {
                    test: /\.(xml|fui)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                publicPath: publicPath + 'assets',
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
                                name: '[name].[ext]',
                                publicPath: publicPath + 'assets',
                                outputPath: 'assets',
                            },
                        },
                    ],
                },
                {
                    test: /\.(mp3|ogg|webm|wav)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                publicPath: publicPath + 'assets',
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

            new DefinePlugin({
                'process.env': JSON.stringify(env),
            }),

            new WorkerPlugin(),
        ],
        //  END ============================================
    };
};
