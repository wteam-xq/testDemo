// 使用 Mock
var Mock = require('mockjs');
Mock.mock(/\.json/, 'get', function(options) {
    return options.type
});
Mock.mock(/\.json/, 'post', function(options) {
    return options.type
});
