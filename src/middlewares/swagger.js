const path = require('path')
const router = require('koa-router')();
const swagger = require('koa2-swagger-ui');
const swaggerJSDoc = require('swagger-jsdoc');
const docOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'Meijie Koa Server API',
          version: '1.0.0',
          contact: {
              name: 'meijie',
              email: 'lmjie_good@163.com'
          }
        },
      },
      apis: [
        path.join(__dirname, '../routers/*.js'),
    ]
}
const swaggerSpec = swaggerJSDoc(docOptions);

router.get('/swagger.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
router.get('/swagger', 
    swagger.koaSwagger({
        routePrefix: false,
        swaggerOptions: {
            url: '/swagger.json',
        }
    })
);

module.exports = router;