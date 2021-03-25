const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelLog = require('../dbmysql/model.log');
const moment = require('moment');
const toRes = require('../helpers/result').toRes;

function toV1(src) {
    return {
        message: src.message,
        uri: src.uri,
        line: src.line,
        linecolumn: src.linecolumn,
        callstack: src.callstack,
        agent: src.agent,
        address: src.address,
        time_create: src.time_create,
    }
}

router.post('/api/v1/log/add', async ctx => {
    let {message, uri, line, linecolumn, callstack, agent} = ctx.request.body;
    if(JSON.stringify(callstack)==JSON.stringify({})){
        callstack = 'not in callstack';
    }
    logger.info(ctx.request.body);
    await modelLog.insert([message, uri, line, linecolumn, callstack, agent, ctx.hostname, moment().format('YYYY-MM-DD HH:mm:ss')])
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = toRes(0, 'insert success');
                logger.info('insert log');
            } else {
                ctx.body = toRes(1, 'insert failure!');
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error(err);
        })  
});

router.post('/api/v1/log/debug', async ctx => {
    let {type, message} = ctx.request.body;
    console.log('debug', type, message);
    console.log('debug', ctx.request.body);
    await Promise.resolve().then(()=>{
        ctx.body = toRes(0, 'post debug success');
    });
});

router.post('/api/v1/log/query', async ctx => {
    let {page, size} = ctx.request.body;
    await modelLog.query(page, size)
        .then(result=>{
            let res = result.data, count = result.count;
            if (res.length > 0) {
                let data = [];                
                for (let i in res) {
                    data.push(toV1(res[i]));
                }
                ctx.body = toRes(0, 'get success');
                ctx.body.count = count;
                ctx.body.data = data;
            } else {
                ctx.body = toRes(1, 'no patient data!');
            }
        }).catch(()=>{
            ctx.body = toRes(-1, 'backend has exception');
        })  
});

module.exports = router;