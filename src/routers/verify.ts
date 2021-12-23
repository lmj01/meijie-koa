
import Koa from 'koa';
import Router from 'koa-router';
import { validPhone, toBody, verifyCode } from '../utils/toolkit';

const router:Router = new Router();

/**
 * @openapi
 * /api/v1/verify/phone:
 *   post:
 *     description: return a verify code
 *     parameters:
 *     - name: phone
 *       description: the phone string, mathch RegExp('1[0-9]{10}')
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: return login token.
 */
router.post('/api/v1/verify/phone', async (ctx: Koa.Context) => {
    let data: {phone:string} = ctx.request.body;
    await Promise.resolve().then(() => {
        if (validPhone(data.phone)) {
            ctx.body = toBody(0, `已发送验证码`, {code: verifyCode() });
        } else {
            ctx.body = toBody(1, `手机号：${data.phone}，不满足格式`, undefined);
        }
    });
});

export default router;