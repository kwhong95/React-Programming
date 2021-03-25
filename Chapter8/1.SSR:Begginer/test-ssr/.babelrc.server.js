const config = require('./.babelrc.common.js');
// 서버에서 필요한 플러그인 추가
config.plugins.push('@babel/plugin-transform-modules-commonjs');
module.exports = config;