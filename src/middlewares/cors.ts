import Koa from 'koa';
import cors from 'koa2-cors';

const whiteDomainList = [
    'http://localhost:9877',
    'http://localhost:3001',
    'http://192.168.0.138:4000',
    'http://192.168.0.138:9000',
];
const whiteApiPathList = [
    '/api/v1/login',
    '/api/v1/register',
];

function isWhiteDomain(origin: string | '') {
    return whiteDomainList.includes(origin);
}

function isWhiteApiPath(apiPath: string|'') {
    return whiteApiPathList.includes(apiPath);
}

export default cors({
    origin: (ctx : Koa.Context) => { //设置允许来自指定域名请求
        console.log('cors--', ctx.url);
        if (ctx.url === '/test') {
            return false;
        }
        // return '*';
        // if (isWhiteDomain(ctx.request.header.origin) || isWhiteApiPath(ctx.url)) {
        //     return ctx.request.header.origin;
        // }
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