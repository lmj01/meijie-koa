
import Koa from 'koa'
import Router from 'koa-router'
import logger from '../middlewares/logger'
import { simplePdf } from '../pdf/test'

const router:Router = new Router();
interface inPdfArg {
    type: string,
}

/**
 * @openapi
 * /api/v2/pdf:
 *   post:
 *     tags:
 *     - pdf
 *     description: return a pdf with customer
 *     produces:
 *     - application/pdf
 *     parameters:
 *     - name: type
 *       description: the pdf type 
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
router.post('/api/v2/pdf', async (ctx: Koa.Context) => {
    console.log('-pdf-', ctx.request)
    let data: inPdfArg = ctx.request.body
    logger.info('-pdf parameters-', data)
    ctx.set('Content-Type', 'application/pdf')
    ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent('测试')}.pdf`)
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')    
    await simplePdf().then((buffer) => {
        // set request with responseType is 'arraybuffer'        
        logger.info('pdf return type', typeof buffer)

        // for (let key in buffer) {

        // }
        const testBuffer = new ArrayBuffer(5)
        const testData = new Uint8Array(testBuffer)
        testData[0] = 1
        testData[1] = 2
        testData[2] = 3
        testData[3] = 4
        testData[4] = 5
        // ctx.body = {
        //     code: 200,
        //     message: 'login success!', 
        //     // buffer: buffer,
        //     buffer: testBuffer,
        // }
        ctx.body = testBuffer
    }).catch((err:Object)=>{
        logger.error('login ', err)
    })  
})

export default router;