
let query = require('./mysql');

/*
病理特征
 */

let features = 
`
create table if not exists features (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL COMMENT '特征编码',
    name VARCHAR(40) NOT NULL COMMENT '特征名称',
    uuid VARCHAR(60) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(features, []);

add = function(value) {
    let sql = 'insert into features set code=?,name=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
find_code = function(code) {
    let sql = `select * from features where code = '${code}'`;
    return query(sql, []);
}
update = function(code, name, timestamp) {
    let sql = `update features set time_update='${timestamp}', name='${name}' where code = '${code}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    find_code: find_code,
    update: update,
}