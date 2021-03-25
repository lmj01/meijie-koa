const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelLanguage = require('../dbmysql/model.language');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');

router.post('/api/v1/languages/add', async ctx => {
    let { code, name, label, description, cover} = ctx.request.body;
    await modelLanguage.find_code(code)
        .then(async (res)=>{
            if (res.length==0) {
                await modelLanguage.add([code, name, label, description, uuidv1(), moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
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
                    await modelLanguage.update(code, name, label, description, moment().format('YYYY-MM-DD HH:mm:ss'))
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