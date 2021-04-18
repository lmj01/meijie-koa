const jwt = require('koa-jwt');

module.exports = jwt({
    secret: 'shared-secret'
});