
import Koa from 'koa';
import Mysql from 'Mysql';
import Router from 'koa-router';
import md5 from 'md5';
import logger from '../middlewares/logger';
import moment from 'moment';
import { v1 } from 'uuid';
const modelUser = require('../dbmysql/model.user');
const token = require('../middlewares/jwtSimple')

interface sLogin {
    email: string,
    password: string,
}

const router:Router = new Router();

interface IUser {
    id: number, 
    nickname: string,
    email: string,
    password: string,
    uuid: string,
    language: string,
    time_create: Date,
    time_update: Date,
}

/**
 * @openapi
 * /api/v1/login:
 *   post:
 *     tags:
 *     - user
 *     description: need email and password to login
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: email
 *       description: the register email
 *       required: true
 *       type: string  
 *     - name: password
 *       description: the password when you register
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: return login token.
 */
router.post('/api/v1/login', async (ctx: Koa.Context) => {
    console.log('-login-', ctx.request)
    let data:sLogin = ctx.request.body
    logger.info('-login-', data);
    // let { email, password } :sLogin = ctx.request.body;
    await modelUser.find(data.email)
        .then((res: Array<{ rows: IUser}>)=>{
            const tmp: IUser = <any>res[0] as IUser;
            console.log('-query-', tmp)
            if (tmp && data.email === tmp.email && md5(data.password) === tmp.password) {
                ctx.body = {
                    code: 0,
                    token: token.encode(tmp.uuid),
                    message: 'login success!', 
                    id: tmp.id, 
                    uuid: tmp.uuid,
                    nickname: tmp.nickname,
                    language: tmp.language,
                }
            } else {
                ctx.body = {
                    code: 1,
                    message: 'email or password is not correct!'
                }
                logger.info('login fail', data.email, data.password, tmp.password, md5(data.password));
            }
        }).catch((err:Object)=>{
            logger.error('login ',err);
        })  
});


/**
 * @openapi
 * /api/v1/logout:
 *   post:
 *     tags:
 *     - user
 *     description: exit to the service
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: email
 *       description: the register email
 *       required: true
 *       type: string  
 *     - name: password
 *       description: the password when you register
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: return login token.
 */
router.post('/api/v1/logout', async (ctx: Koa.Context) => {
    await Promise.resolve(ctx.request.body)
        .then((body)=>{
            ctx.body = {
                code: 0,
                message: '退出成功',
            }
        });
});

/**
 * @openapi
 * /api/v1/register:
 *   post:
 *     tags:
 *     - user
 *     description: register a new user
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: nickname
 *       description: the nick name
 *       required: true
 *       type: string  
 *     - name: email
 *       description: the register email
 *       required: true
 *       type: string  
 *     - name: password
 *       description: the password when you register
 *       type: string
 *       required: true
 *     - name: password2
 *       description: the confirm password
 *       type: string
 *       required: true
 *     - name: language
 *       description: the language page
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: return is ok or failed message
 */
router.post('/api/v1/register', async (ctx: Koa.Context) => {
    let { nickname, email, password, password2, language} = ctx.request.body;
    console.log('-register-', ctx.request.body, v1())
    // 默认语言设置为汉语
    if (!language) language = 'cn';
    await modelUser.find(email)
        .then(async (result: Mysql.Query) => {
            logger.info(result);
            if (result.values && result.values.length >=  0) {
                ctx.body = {
                    code: 1, 
                    message: email + ' has registered!'
                }
            } else {
                if (password !== password2) {
                    ctx.body = {
                        code: 2, 
                        message: `两次密码不一致`
                    }
                } else {
                    await modelUser.insert([nickname, email, md5(password), v1(), language, 
                        moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
                        .then((res: Mysql.Query)=>{                    
                            ctx.body = {
                                code: 0,
                                message: 'register succcess!'
                            }
                        });   
                }             
            }
        }).catch((err:Object)=>{
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
router.post('/api/v1/empty', async (ctx: Koa.Context)=>{
    let {header} = ctx.request;
    console.log('empty authorization -- ', header.authorization)
    let payload = token.decode(header.authorization);
    await modelUser.findByUuid(payload.uuid)
        .then(async (res: Mysql.Query)=>{
            console.log('find --', res);
            ctx.body = {
                code: 0,
                message: 'empty action request'
            }            
        })
        .catch((err:Object) => {
            logger.error('empty action', err);
        })
})

/**
 * @openapi
 * /api/AI_Classification:
 *   post:
 *     description: classification the images
 *     responses:
 *       200:
 *         description: Returns 'empty action request' .
 */
router.post('/api/AI_Classification', async (ctx: Koa.Context)=>{
    let {header} = ctx.request;
    await Promise.resolve().then(() => {
            console.log('find --', ctx);
            ctx.body = {
                code: 0,
                message: 'no value'
            }            
        })
        .catch((err:Object) => {
            logger.error('empty action', err);
        })
})

/**
 * @openapi
 * /api/v1/booking:
 *   post:
 *     description: booking the contact
 *     parameters:
 *     - name: nickname
 *       description: the nick name
 *       required: true
 *       type: string  
 *     responses:
 *       200:
 *         description: return status code.
 */
router.post('/api/v1/booking', async (ctx: Koa.Context)=>{
    logger.info('booking', ctx);
    await Promise.resolve(1)
        .then(async (res)=>{
            console.log('booking return', res);
            ctx.body = {
                code: 0,
                message: 'empty action request'
            }            
        })
});

// router.post('/api/v1/update/language', async (ctx: Koa.Context)=>{
//     let {uuid, language} = ctx.request.body;
//     await modelUser.update_language(uuid, language)
//         .then(async (res: Mysql.Query)=>{
//             if (res.affectedRows == 1) {
//                 ctx.body = {
//                     code: 0,
//                     message: 'update language success'
//                 }
//             } else {
//                 ctx.body = {
//                     code: 1, 
//                     message: 'update language failure!'
//                 }
//             }
//         }).catch((err: Object)=>{
//             logger.error('update password', err);
//         });
// })


export default router;