import Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import bodyParser from 'koa-body';
import KoaStatic from 'koa-send';

import middleCors from '../middlewares/cors';
import middleJwt from '../middlewares/jwt';
import logger from '../middlewares/logger';

import userController from '../routers/user';
import pdfController from '../routers/pdf';
import swaggerController from '../middlewares/swagger';
import notfoundController from '../routers/notfound';


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
app.use(middleJwt);


app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    // const body = ctx.request.body;
    // console.log(`response -- ${ctx.method}, ${ctx.path}, ${ctx.hostname}, ${rt}`);
});
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    const start = Date.now();
    await next();
    if (['/www', '/www/'].includes(ctx.path)) {
        ctx.url = '/www/index.html';   
    }
    console.log('-ctx-', ctx.url);
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with');
    ctx.set('Access-Control-Max-Age', '86400');
    // 暴露一些header，没起作用，下载时需要文件名
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
});

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch(err: any) {
        console.log('catch error', err);
        ctx.status = err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        err.status = ctx.status;
        ctx.body = {err};
        ctx.app.emit('error', err, ctx);
    }
});

app.use(userController.routes());
// app.use(userController.allowedMethods());
app.use(pdfController.routes());
app.use(swaggerController.routes());
app.use(async (ctx) => {
    console.log('static ', ctx.path);
    if (['/www', '/www/'].includes(ctx.path)) {
        console.log('redirect to /www/index.html')
        ctx.response.redirect('/www/index.html#/');
        // ctx.response.redirect('/www/#/');
    }
    await KoaStatic(ctx, ctx.path, { root: __dirname + '../../../public' });
})
app.on('error', console.error);

export default app;