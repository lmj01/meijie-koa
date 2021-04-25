
import Koa from 'koa';
import Mysql from 'Mysql';
import Router from 'koa-router';
import md5 from 'md5';
import logger from '../middlewares/logger';
// import moment from 'moment';
// import uuid from 'uuid';
const modelUser = require('../dbmysql/model.user');
const token = require('../middlewares/jwtSimple')

interface sLogin {
    email: string,
    password: string,
}

const router:Router = new Router();

// router.post('/api/v1/logout', async (ctx: Koa.Context) => {
//     ctx.session = null;
//     await Promise.resolve(ctx.request.body)
//         .then((body)=>{
//             ctx.body = {
//                 code: 0,
//                 message: '退出成功',
//             }
//         });
// });

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
                ctx.session = {
                    nickname: tmp.nickname,
                    email: tmp.email,
                    id: tmp.id,
                    uuid: tmp.uuid,
                }
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
                logger.info('login fail', data.email, data.password);
            }
        }).catch((err:Object)=>{
            logger.error('login ',err);
        })  
});

// router.post('/api/v1/register', async (ctx: Koa.Context) => {
//     let { nickname, email, password, language} = ctx.request.body;
//     console.log('-register-', ctx.request.body, uuid.v1())
//     // 默认语言设置为汉语
//     if (!language) language = 'cn';
//     await modelUser.find(email)
//         .then(async (result: Mysql.Query) => {
//             logger.info(result);
//             if (result.length >=  1) {
//                 ctx.body = {
//                     code: 1, 
//                     message: email + ' has registered!'
//                 }
//             } else {
//                 await modelUser.insert([nickname, email, md5(password), uuid.v1(), language, 
//                     moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])
//                     .then((res: Mysql.Query)=>{                    
//                         ctx.body = {
//                             code: 0,
//                             message: 'register succcess!'
//                         }
//                     });                
//             }
//         }).catch((err:Object)=>{
//             logger.error('register ', err);
//         });
// });

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