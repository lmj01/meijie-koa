
let query = require('./mysql');

/*
矫治方法
 */

let methods = 
`
create table if not exists methods (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL COMMENT '特征编码',
    name VARCHAR(40) NOT NULL COMMENT '特征名称',
    uuid VARCHAR(60) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(methods, []);

exports.add = function(value) {
    let sql = 'insert into methods set code=?,name=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
exports.find_code = function(code) {
    let sql = `select * from methods where code = '${code}'`;
    return query(sql, []);
}
exports.update = function(code, name, uuid) {
    let sql = `update methods set code='${code}', name='${name}' where uuid = '${uuid}'`;
    return query(sql, []);
}