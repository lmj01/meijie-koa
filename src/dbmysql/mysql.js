const mysql = require('mysql');
const config = require('../../config/default');

let pool = mysql.createPool(config.mysql);
let query = function(sql, values) {
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

module.exports = query;