const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelUser = require('../dbmysql/model.user');
const md5 = require('md5');
const moment = require('moment');
const uuid = require('uuid');   
const token = require('../middlewares/jwtSimple')

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
                    token: token.encode(res[0]['uuid']),
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

router.post('/api/v1/register', async (ctx) => {
    let { nickname, email, password, language} = ctx.request.body;
    console.log('-register-', ctx.request.body, uuid.v1())
    // 默认语言设置为汉语
    if (!language) language = 'cn';
    await modelUser.find(email)
        .then(async (result) => {
            logger.info(result);
            if (result.length >=  1) {
                ctx.body = {
                    code: 1, 
                    message: email + ' has registered!'
                }
            } else {
                await modelUser.insert([nickname, email, md5(password), uuid.v1(), language, 
                    moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then((res)=>{                    
                        ctx.body = {
                            code: 0,
                            message: 'register succcess!'
                        }
                    });                
            }
        }).catch((err)=>{
            logger.error('register ', err);
        });
});

/**
 * @openapi
 * /api/v1/empty:
 *   post:
 *     description: empty action for test request
 *     responses:
 *       200:
 *         description: Returns 'empty action request' .
 */
router.post('/api/v1/empty', async ctx=>{
    let {header} = ctx.request;
    console.log('empty authorization -- ', header.authorization)
    let payload = token.decode(header.authorization);
    await modelUser.findByUuid(payload.uuid)
        .then(async (res)=>{
            console.log('find --', res);
            ctx.body = {
                code: 0,
                message: 'empty action request'
            }            
        })
        .catch((err) => {
            logger.error('empty action', err);
        })
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