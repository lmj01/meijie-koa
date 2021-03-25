const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelUser = require('../dbmysql/model.user');
const md5 = require('md5');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');

router.post('/api/v1/logout', async ctx => {
    ctx.session = null;
    await Promise.resolve(ctx.request.body)
        .then((body)=>{
            ctx.body = {
                code: 0,
                message: '退出成功',
            }
        });
});

router.post('/api/v1/login', async ctx => {
    let { email, password } = ctx.request.body;
    await modelUser.find(email)
        .then(res=>{
            if (res.length && email === res[0]['email'] && md5(password) === res[0]['password']) {
                ctx.session = {
                    nickname: res[0]['nickname'],
                    email: res[0]['email'],
                    id: res[0]['id'],
                    uuid: res[0]['uuid']
                }
                ctx.body = {
                    code: 0,
                    message: 'login success!', 
                    id: res[0]['id'], 
                    uuid: res[0]['uuid'],
                    nickname: res[0]['nickname'],
                    language: res[0]['language']
                }
            } else {
                ctx.body = {
                    code: 1,
                    message: 'email or password is not correct!'
                }
                logger.info('login fail', email, password);
            }
        }).catch(err=>{
            logger.error('login ',err);
        })  
});

router.post('/api/v1/register', async ctx => {
    let { nickname, email, password, language} = ctx.request.body;
    // 默认语言设置为汉语
    if (!language) language = 1;
    await modelUser.find(email)
        .then(async (result) => {
            logger.info(result);
            if (result.length >=  1) {
                ctx.body = {
                    code: 1, 
                    message: email + ' has registered!'
                }
            } else {
                await modelUser.insert([nickname, email, md5(password), uuidv1(), language, 
                    moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res=>{                    
                        ctx.body = {
                            code: 0,
                            message: 'register succcess!'
                        }
                    });                
            }
        }).catch(err=>{
            logger.error('register ', err);
        });
});

router.post('/api/v1/update/password', async ctx=>{
    let {uuid, password, newpassword} = ctx.request.body;
    await modelUser.find_uuid(uuid, md5(password))
        .then(async (res)=>{
            if (res.length == 1) {
                await modelUser.update_password(uuid, md5(newpassword))
                    .then(res2=>{
                        if (res2.affectedRows==1) {
                            ctx.body = {
                                code: 0,
                                message: 'update password success'
                            }
                        } else {
                            ctx.body = {
                                code: 1,
                                message: 'update password success'
                            }
                        }
                    })
            } else {
                ctx.body = {
                    code: 1, 
                    message: 'the user not exist or password not correct!'
                }
            }
        }).catch(err=>{
            logger.error('update password', err);
        });
})

router.post('/api/v1/update/language', async ctx=>{
    let {uuid, language} = ctx.request.body;
    await modelUser.update_language(uuid, language)
        .then(async (res)=>{
            if (res.affectedRows == 1) {
                ctx.body = {
                    code: 0,
                    message: 'update language success'
                }
            } else {
                ctx.body = {
                    code: 1, 
                    message: 'update language failure!'
                }
            }
        }).catch(err=>{
            logger.error('update password', err);
        });
})


module.exports = router;