
let query = require('./mysql');

let log = 
`
create table if not exists log (
    id INT NOT NULL AUTO_INCREMENT,
    message TINYTEXT COMMENT '消息',
    uri TINYTEXT COMMENT '路径',
    line int COMMENT '行',
    linecolumn int COMMENT '列',
    callstack TEXT COMMENT '函数调用栈',
    agent TINYTEXT COMMENT 'userAgent',
    address VARCHAR(60) COMMENT 'ip address',
    time_create TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY(id)
);
`;

query(log, []);

let insert = function(value) {
    let sql = 'insert into log set message=?,uri=?,line=?,linecolumn=?,callstack=?,agent=?,address=?,time_create=?;';
    return query(sql, value);
}

let query_range = function(uuid, page, size) {
    if (page < 1) page = 1;
    if (size < 1) size = 10;
    let from = (page-1) * size, to = from + size;
    let sqlRange = `select * from log order by time_create limit ${from},${to}`;
    let sqlCount = `select COUNT(*) from log`;
    return Promise.resolve(query(sqlRange, []))
        .then(res=>{
            return Promise.resolve(query(sqlCount, []))
                .then(res2=>{
                    return Promise.resolve({data: res, count: res2[0]['COUNT(*)']})
                })
        })
}

module.exports = {
    insert: insert,
    query: query_range,
}