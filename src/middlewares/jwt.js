const jwt = require('koa-jwt');
const jwtConfig = require('../../config/jwt');

module.exports = jwt({
    secret: jwtConfig.secret,
})
.unless({
    path: [
        /^\/api\/v1\/login/,
        /^\/api\/v1\/register/,
        /^\/swagger/,
        /^\/favicon./
    ]
})
;