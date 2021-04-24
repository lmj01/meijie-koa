const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7
module.exports = {
    // 密钥
    secret: 'jwtSecret',
    // 过期时间
    expiresTime: tokenExpiresTime,
}