
import Koa from 'koa';
import Router from 'koa-router';

const router:Router = new Router();

/**
 * @openapi
 * /api/notfound:
 *   post:
 *     tags:
 *     - pdf
 *     description: return a pdf with customer
 *     produces:
 *     - application/pdf
 *     parameters:
 *     responses:
 *       200:
 *         description: return login token.
 */
router.post('/api/v2/notfound', async (ctx: Koa.Context) => {
    await Promise.resolve().then(() => {
        ctx.body = 'not found';
    });
});

export default router;