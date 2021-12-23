import mysql from 'mysql';
import config from '../../config/mysql';

const pool = mysql.createPool(config);

export const query = function(sql: string, values: Array<string>) {
    return new Promise((resolve, reject)=>{
        pool.getConnection(function(err: mysql.MysqlError, conn: mysql.PoolConnection){
            if (err) {
                reject(err)
            } else {
                conn.query(sql, values, (error: mysql.MysqlError | null, rows: any)=>{
                    if (error) {
                        reject(error)
                    } else {
                        resolve(rows)
                    }
                    conn.release();
                })
            }
        })
    })
}
