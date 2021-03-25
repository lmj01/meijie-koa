const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelFeatures = require('../dbmysql/model.features');
const modelMethods = require('../dbmysql/model.methods');
const moment = require('moment');
const uuidv1 = require('uuid/v1');

async function fetchParameters() {
    
}

router.post('/api/v1/list/add/parameters', async ctx => {
    let {uuid} = ctx.request.body;
    await modelFeatures.find_code(code)
        .then(async (res)=>{
            if (res.length==0) {
                await modelFeatures.add([code, name, uuidv1(), moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
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
                    await modelFeatures.update(code, name, moment().format('YYYY-MM-DD HH:mm:ss'))
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