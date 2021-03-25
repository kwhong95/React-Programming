const config = require('./.babelrc.common.js');
// 클라이언트에서 필요한 프리셋 추가
config.presets.push('@babel/preset-env');
module.exports = config;