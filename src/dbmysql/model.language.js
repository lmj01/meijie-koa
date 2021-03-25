
let query = require('./mysql');

/*
语言设置
 */

let languages = 
`
create table if not exists languages (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL COMMENT '语言编码',
    name VARCHAR(40) NOT NULL COMMENT '语言名称',
    label VARCHAR(40) NOT NULL COMMENT '页面语言',
    description VARCHAR(40) DEFAULT NULL COMMENT '描述语言',
    uuid VARCHAR(60) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(languages, []);

add = function(value) {
    let sql = 'insert into languages set code=?,name=?,label=?,description=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
find_code = function(code) {
    let sql = `select * from languages where code = '${code}'`;
    return query(sql, []);
}
update = function(code, name, label, description, timestamp) {
    let sql = `update languages set time_update='${timestamp}', name='${name}', label='${label}', description='${description}', where code = '${code}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    find_code: find_code,
    update: update,
}