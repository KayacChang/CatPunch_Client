module.exports = {
    extends: 'google',
    parser: 'babel-eslint',
    plugins: ['flowtype'],
    rules: {
        'space-before-function-paren': 'off',
        'require-jsdoc': 'off',
        indent: ['error', 4],
        'new-cap': 'off',
        'no-invalid-this': 'off',
    },
};
