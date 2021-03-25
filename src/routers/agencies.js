const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelAgencies = require('../dbmysql/model.agencies');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');

router.post('/api/v1/agency/get', async ctx => {
    let {user_uuid} = ctx.request.body;
    await modelAgencies.get_by_uuid(user_uuid)
        .then(res=>{
            if (res.length>0) {
                let agency = [];                
                for (let i in res) {
                    agency.push({
                        name: res[i].name,
                        address: res[i].address,
                        uuid: res[i].uuid,   
                    });
                }
                ctx.body = {
                    code: 0,
                    message: 'get success',
                    data: agency,
                } 
                logger.info('agency get:', user_uuid);
            } else {
                ctx.body = {
                    code: 1,
                    message: 'no agency data!'
                }
            }
        }).catch(err=>{
            logger.error('agency get ',err);
            ctx.body = {
                code: -1,
                message: '后台异常',
            }
        }) 
});

router.post('/api/v1/agency/add', async ctx => {
    let {user_uuid, name, address} = ctx.request.body;
    await modelAgencies.add([user_uuid, name, address, uuidv1(), moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = {
                    code: 0,
                    message: 'add success',
                }
                logger.info('agency add:', name, address);
            } else {
                ctx.body = {
                    code: 1,
                    message: 'add failure!'
                }
            }
        }).catch(err=>{
            logger.error('agency add ',err);
        }) 
});

router.post('/api/v1/agency/update', async ctx => {
    let { uuid, name, address} = ctx.request.body;
    await modelAgencies.find_uuid(uuid)
        .then(async (res)=>{
            if (res.length==1) {
                await modelAgencies.update(uuid, name, address, moment().format('YYYY-MM-DD HH:mm:ss'))
                    .then(res2=>{
                        if (res2.affectedRows == 1) {
                            ctx.body = {
                                code: 0,
                                message: 'add success',
                            }
                            logger.info('agency add:', uuid, name, address);
                        } else {
                            ctx.body = {
                                code: 1,
                                message: 'add failure!'
                            }
                        }
                    })  
            } else {
                ctx.body = {
                    code: 2,
                    message: `agency is not exists!`
                }
            }            
        }).catch(err=>{
            logger.error('agency update ',err);
        })
});
module.exports = router;