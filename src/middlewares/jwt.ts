import jwt from 'koa-jwt';
import jwtConfig from '../../config/jwt';

export default jwt({
    secret: jwtConfig.secret,
}).unless({
    // 过滤掉不需要验证的http request
    path: jwtConfig.whiteUrl,
});