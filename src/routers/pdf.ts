
import Koa from 'koa'
import Router from 'koa-router'
import logger from '../middlewares/logger'
import { simplePdf, PdfParameter, customerPdf } from '../pdf/test'

const router:Router = new Router();

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
 *     responses:
 *       200:
 *         description: status code
 */
router.post('/api/v2/pdf', async (ctx: Koa.Context) => {
    console.log('-pdf-', ctx.request)
    await simplePdf().then((buffer) => {
        ctx.attachment(`simple.pdf`);
        // ctx.attachment(`${encodeURIComponent('simple完善')}.pdf`);
        ctx.type = 'application/octet-stream';
        ctx.body = Buffer.from(buffer);
    }).catch((err:Object)=>{
        logger.error('login ', err)
    })  
})

/**
 * @openapi
 * /api/v2/pdfstyle:
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
 *     - name: name
 *       description: the name
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: return login token.
 */
router.post('/api/v2/pdfstyle', async (ctx: Koa.Context) => {
    console.log('-pdf-', ctx.request)
    let data: PdfParameter = ctx.request.body
    logger.info('-pdf parameters-', data)
    await customerPdf(data).then((buffer) => {
        ctx.attachment('customer.pdf');
        ctx.type = 'application/octet-stream';
        ctx.body = Buffer.from(buffer);
    }).catch((err:Object)=>{
        logger.error('login ', err)
    })  
})

/**
 * @openapi
 * /api/v2/buffer:
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
router.post('/api/v2/buffer', async (ctx: Koa.Context) => {
    console.log('-buffer-', ctx.request, ctx.response);
    ctx.body = Buffer.from('abc');
    logger.info('-response info-', ctx.response);
});
/**
 * @openapi
 * /api/v2/getbuffer:
 *   get:
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
router.get('/api/v2/getbuffer', async (ctx: Koa.Context) => {
    ctx.body = Buffer.from('abcdefgh');
});

export default router;