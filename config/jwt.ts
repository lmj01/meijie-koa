const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7
export interface JwtConfig {
    secret: string,
    expiresTime: number,
    whiteUrl: Array<RegExp>,
}
const jwtConfig : JwtConfig = {
    // 密钥
    secret: 'jwtSecret',
    // 过期时间
    expiresTime: tokenExpiresTime,
    // 无需认证的http request url
    whiteUrl: [
        /^\/api\/v1\/login/,
        /^\/api\/v1\/booking/,
        /^\/api\/v1\/verify\/phone/,
        /^\/api\/v1\/register/,
        /^\/swagger/,
        /^\/www/,
        /^\/favicon./
    ],
};

export default jwtConfig;