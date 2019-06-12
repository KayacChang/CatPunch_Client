/*
 *   **Important**
 *      This file made for path Redirecting.
 */

//  Imports
const {resolve} = require('path');

//  Root Path
const rootPath = __dirname;

//  Project Element Path
const sourceDir = resolve(rootPath, 'src');
const baseDir = resolve(rootPath, 'base');
const toolDir = resolve(rootPath, 'tools');
const productDir = resolve(rootPath, 'dist');

//  Public Path
const publicPath = '';

//  GameID
const gameID = 'A173D52E01A6EB65A5D6EDFB71A8C39C';

//  Logintype
const loginType = 3;

//  Server URL
const devServerURL = 'http://13.112.112.160:8000';
// 'http://192.168.1.14:8000';
const prodServerURL = 'http://13.112.112.160:8000';

module.exports = {
    sourceDir,
    baseDir,
    toolDir,
    productDir,
    publicPath,

    gameID,
    loginType,
    devServerURL,
    prodServerURL,
};
