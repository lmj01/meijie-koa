const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelMethods = require('../dbmysql/model.methods');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');

router.post('/api/v1/methods/add', async ctx => {
    // cover : 1覆盖， 0忽略
    let { code, name, cover} = ctx.request.body;
    await modelMethods.find_code(code)
        .then(async (res)=>{
            if (res.length==0) {
                await modelMethods.add([code, name, uuidv1(), moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res2=>{
                        if (res2.affectedRows == 1) {
                            ctx.body = {
                                code: 0,
                                message: 'add success',
                            }
                            logger.info('features add:', code, name);
                        } else {
                            ctx.body = {
                                code: 1,
                                message: 'add failure!'
                            }
                        }
                    })  
            } else {
                if (cover=='1') {
                    await modelMethods.update(code, name, moment().format('YYYY-MM-DD HH:mm:ss'))
                        .then(res2=>{
                            if (res2.affectedRows==1) {
                                ctx.body = {
                                    code: 2,
                                    message: `${name} cover success!`            
                                }
                                logger.info('features add:', code, name);
                            }
                        })
                } else {
                    ctx.body = {
                        code: 2,
                        message: `${code} is exists!`
                    }
                }
            }            
        }).catch(err=>{
            logger.error('features add ',err);
        })
});

module.exports = router;