import jwt from 'koa-jwt';
import jwtConfig from '../../config/jwt';

export default jwt({
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