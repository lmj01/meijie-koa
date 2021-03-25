const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelTimebar = require('../dbmysql/model.timebar');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');

function toV1(src) {
    return {
        createday: src.createday,
        type: src.type,
        uuid: src.uuid,
    }
}

router.post('/api/v1/timebar/get', async ctx => {
    let {case_uuid} = ctx.request.body;
    await modelTimebar.get_by_uuid(case_uuid)
        .then(res=>{
            if (res.length>0) {
                let data = [];                
                for (let i in res) {
                    data.push(toV1(res[i]));
                }
                ctx.body = {
                    code: 0,
                    message: 'get success',
                    data: data,
                } 
                logger.info('timebar get:', case_uuid);
            } else {
                ctx.body = {
                    code: 1,
                    message: 'no timebar data!'
                }
            }
        }).catch(err=>{
            logger.error('timebar get ',err);
            ctx.body = {
                code: -1,
                message: '后台异常',
            }
        }) 
});

router.post('/api/v1/timebar/add', async ctx => {
    let {case_uuid, type, createday} = ctx.request.body;
    await modelTimebar.add([case_uuid, type, createday, uuidv1(), moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = {
                    code: 0,
                    message: 'add success',
                }
                logger.info('timebar add:', case_uuid, type, createday);
            } else {
                ctx.body = {
                    code: 1,
                    message: 'add failure!'
                }
            }
        }).catch(err=>{
            logger.error('timebar add ',err);
        }) 
});

router.post('/api/v1/timebar/change', async ctx => {
    let {uuid} = ctx.request.body;
    await modelTimebar.update_tomiddle(uuid, moment().format('YYYY-MM-DD HH:mm:ss'))
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = {
                    code: 0,
                    message: 'change success',
                }
                logger.info('timebar change:', uuid);
            } else {
                ctx.body = {
                    code: 1,
                    message: 'change failure!'
                }
            }
        }).catch(err=>{
            logger.error('timebar change ',err);
        }) 
});

module.exports = router;