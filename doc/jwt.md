# koa-jwt

JW(Json web token)是为了在网络应用环境间传递声明来执行一种基于JSON的开发标准RFC7519. 适用于分布式站点的单点登录SSO场景，起身份认证的作用

这是因为HTTP是无状态的协议，传统处理的服务器存储一份用户登录信息，在效应时传递给浏览器，浏览器存储在cookie中，下次请求时发送给服务器。
这样存在的问题主要有两个
- 扩展性，对于单服务器没有多大影响，但是分布式就存在认证的复杂性
- CSRF，基于cookie存储会导致受跨站请求伪造攻击

1. 作为一个插件使用，传入密钥，使用公共加密函数进行加密得到一个token字符串
把token作为登录成功的信息返回给用户

2. 用户每次其他request都要携带token，后台拿到token时就可以通过密钥解密出来
得到加密的内容

```javascript
// 设置载荷
let payload = {
    iss: 签发者
    sub: 面向用户
    aud: 接收方
    exp: 过期时间
    nbf: 延迟处理时间，在这之前都不起作用
    iat: 签发时间
    jti: 唯一身份标识
}
// 对载荷进行签证signature得到token
token = encode(payload, secret)
// 解密得到token前的有效载荷
payload = decode(token, secret)
```

引入新问题，token快过期的处理，就想现在很多应用到时间了强制退出或重新登录确认一下，来重新获取token，也就说存在两个token，
一个正常的token，另一个就是refresh token，如何处理好这个就比较难处理了，特别是客户端存储了token，要如何方便客户端更新本地的token，又与业务层逻辑无关，就现得体验非常难把握了。
