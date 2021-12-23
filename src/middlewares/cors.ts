import Koa from 'koa';
import cors from 'koa2-cors';
import logger from '../middlewares/logger';

const whiteDomainList = [
    'http://localhost:3001',
    'http://192.168.0.138:4000',
];
const whiteApiPathList = [
    '/api/v1/login',
    '/api/v1/logout',
    '/api/v1/register',
    '/api/v1/booking',
];

function isWhiteDomain(origin: string | undefined) {
    if (origin) return whiteDomainList.includes(origin);
    return false;
}

function isWhiteApiPath(apiPath: string|'') {
    return whiteApiPathList.includes(apiPath);
}

export default cors({
    origin: (ctx : Koa.Context) => { //设置允许来自指定域名请求
        console.log('-cors-', ctx.url);
        if (ctx.url === '/test') {
            return false;
        }
        // 检验request的header origin, 同域的放过，或白名单的放过
        if (isWhiteDomain(ctx.request.header.origin)) {
            return ctx.request.header.origin || false;
        }
        if (isWhiteApiPath(ctx.url)) { // with 
            console.log('--login with no cookie---');
            return '*'; // 允许来自所有域名请求
        }
        // return 'http://localhost:3000'; //只允许http://localhost:8080这个域名的请求
        return false;
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
});