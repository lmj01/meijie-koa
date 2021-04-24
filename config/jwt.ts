const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7
export interface JwtConfig {
    secret: string,
    expiresTime: number,
}
const jwtConfig : JwtConfig = {
    // 密钥
    secret: 'jwtSecret',
    // 过期时间
    expiresTime: tokenExpiresTime,
};

export default jwtConfig;