import Koa from 'koa';
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
        path.join(__dirname, '../routers/*.ts'),
    ],
    servers: [
        {
            "url": "http://localhost:{port}/{basePath}",
            "description": "The production API server",
            "variables": {
              "username": {
                "default": "demo",
                "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
              },
              "port": {
                "enum": [
                  "3000",
                  "443"
                ],
                "default": "3000"
              },
              "basePath": {
                "default": "v2"
              }
            }
        }
    ],
}
const swaggerSpec = swaggerJSDoc(docOptions);

router.get('/swagger.json', async (ctx :Koa.Context) => {
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

export default router;