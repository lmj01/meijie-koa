import mysql from 'mysql';
import config from '../../config/mysql';

const pool = mysql.createPool(config);

const query = function(sql: string, values: Array<string>) {
    return new Promise((resolve, reject)=>{
        pool.getConnection(function(err, conn){
            if (err) {
                reject(err)
            } else {
                conn.query(sql, values, (error, rows)=>{
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

export default query;