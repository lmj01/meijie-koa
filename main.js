
const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-body');
const session = require('koa-session-minimal');
const mysqlStore = require('koa-mysql-session');
const staticCache = require('koa-static');

const config = require('./config/default');

const app = new Koa();

app.use(require('./src/middlewares/cors'));
app.use(require('./src/middlewares/jwt'));

app.use(session({
    key: 'user_sid',
    store: new mysqlStore({
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        host: config.mysql.host
    }),
    cookie: {
        // domain: 'localhost',
        domain: '192.168.0.138',
        maxAge: 1000 * 30,
        httpOnly: true,
        overwrite: false,
        sameSite: "none"
    }
}));

app.use(staticCache(path.join(__dirname, './public'), {
    dynamic: true
}, {
    maxAge: 365 * 24 * 60 * 60
}));

app.use(staticCache(path.join(__dirname, './images'), {
    dynamic: true
}, {
    maxAge: 365 * 24 * 60 * 60
}));
app.use(bodyParser({
    formidable: {
        uploadDir:'./uploadfiles',
        maxFileSize: 200*1024*1024, // 文件大小限制，默认2M
    },
    requestBody: 'body',
    requestFiles: 'files',
    multipart: true,
    urlencoded: true
}));
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    const body = ctx.request.body;
    console.log('request', ctx.request, body);
    console.log(`response -- ${ctx.method}, ${ctx.path}, ${ctx.hostname}, ${rt}`);
});
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with');
    ctx.set('Access-Control-Max-Age', '86400');
});

app.use(require('./src/routers/login').routes());
app.use(require('./src/routers/patient').routes());
app.use(require('./src/routers/features').routes());
app.use(require('./src/routers/methods').routes());
app.use(require('./src/routers/language').routes());
app.use(require('./src/routers/agencies').routes());
app.use(require('./src/routers/timebar').routes());
app.use(require('./src/routers/myfile').routes());
app.use(require('./src/routers/log').routes());
app.on('error', err=>{
    console.log('server error', err);		
});

app.listen(config.port);
console.log(`server listen on ${config.port}`);