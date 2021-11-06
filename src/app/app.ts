import Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import bodyParser from 'koa-body'

import middleCors from '../middlewares/cors';
import middleJwt from '../middlewares/jwt';
import {logInfo} from '../middlewares/logger';

import userController from '../routers/user';
import pdfController from '../routers/pdf';
import swaggerController from '../middlewares/swagger';

const app: Koa = new Koa();

app.use(bodyParser({
    // formidable: {
    //     uploadDir:'./uploadfiles',
    //     maxFileSize: 200*1024*1024, // 文件大小限制，默认2M
    // },
    // requestBody: 'body',
    // requestFiles: 'files',
    // multipart: true,
    // urlencoded: true
}));

app.use(middleCors);
//todo 暂时不使用认证环
// app.use(middleJwt);


app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    const body = ctx.request.body;
    // console.log('request', ctx.request, body);
    // console.log
    logInfo.info
    (`response -- ${ctx.method}, ${ctx.path}, ${ctx.hostname}, ${rt}`);
});
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with');
    ctx.set('Access-Control-Max-Age', '86400');
});

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch(err: any) {
        ctx.status = err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        err.status = ctx.status;
        ctx.body = {err};
        ctx.app.emit('error', err, ctx);
    }
});

app.use(userController.routes())
app.use(pdfController.routes())
app.use(userController.allowedMethods());

app.use(swaggerController.routes());

app.on('error', console.error);

export default app;