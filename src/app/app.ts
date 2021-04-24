import Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import bodyParser from 'koa-body'

import middleCors from '../middlewares/cors';
import middleJwt from '../middlewares/jwt';

import userController from '../routers/user';
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
app.use(middleJwt);

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch(err) {
        ctx.status = err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        err.status = ctx.status;
        ctx.body = {err};
        ctx.app.emit('error', err, ctx);
    }
});

app.use(userController.routes());
app.use(userController.allowedMethods());

app.use(swaggerController.routes());

app.on('error', console.error);

export default app;