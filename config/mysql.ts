export interface ConfigMysql {
    database: string,
    user: string,
    password: string,
    port: number,
    host: string,
}
const config: ConfigMysql = {
    database: 'koa_meijie',
    user: 'root',
    password: 'lmjpassword',
    port: 3306,
    host: 'localhost'
}

export default config
