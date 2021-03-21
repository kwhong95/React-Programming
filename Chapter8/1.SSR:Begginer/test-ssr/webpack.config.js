const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    modules: {
        rules: [
            {
                test: /\.js$/,
                // 모든 자바스크립트 파일을 babel-loader 로 처리
                use: 'babel-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            // 아래 파일을 기반으로 HTML 파일을 생성
            template: './template/index.html',
        }),
    ],
    mode: 'production',
}