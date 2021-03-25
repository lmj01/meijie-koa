const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const logger = require('../middlewares/logger');
const modelInfo = require('../dbmysql/model.fileinfo');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');
const toRes = require('../helpers/result').toRes;

function toV1(src) {
    return {
        createday: src.createday,
        type: src.type,
        uuid: src.uuid,
    }
}
router.post('/api/v1/myfile/get', async ctx => {
    let body = ctx.request.body,
        args = JSON.parse(body);
    logger.info(args, args.url);
    let filepath = path.join(__dirname+"../../../public/images/", args.url);
    let file = null;
    try {
        file = fs.readFileSync(filepath);
    } catch(err) {
        logger.info(err);
        filepath = path.join(__dirname, '/../../public/images/1.jpg');
        file = fs.readFileSync(filepath);
    }
    ctx.set('content-type', 'application/octet-stream');
    ctx.body = file;
});

router.post('/api/v1/fileinfo/add', async ctx => {
    let {files} = ctx.request, file = files.file;
    let uuid = uuidv1();
    await modelInfo.add([file.name, file.type, file.path, file.size, uuid, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
        .then(res=>{
            console.log(res);
            if (res.affectedRows>0) {
                ctx.body = toRes(0, 'add success');
                ctx.body.uuid = uuid;
                ctx.body.path = file.path;
                logger.info('file add:', file.name, file.path);
            } else {
                ctx.body = toRes(1, 'no timebar data!');
            }
        }).catch(err=>{
            logger.error('file add ',err);
            ctx.body = toRes(-1, 'backend exception');
        }) 
});

router.post('/api/v1/fileinfo/get', async ctx => {
    let {uuid} = ctx.request.body;
    await modelInfo.get(uuid)
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

module.exports = router;