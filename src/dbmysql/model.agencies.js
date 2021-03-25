
let query = require('./mysql');

/*
医生的机构名称
 */

let agencies = 
`
create table if not exists agencies (
    id INT NOT NULL AUTO_INCREMENT,
    user_uuid VARCHAR(60) NOT NULL COMMENT '登录用户的uuid',
    name VARCHAR(40) NOT NULL COMMENT '名称',
    address VARCHAR(40) NOT NULL COMMENT '地址',
    uuid VARCHAR(40) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(agencies, []);

let add = function(value) {
    let sql = 'insert into agencies set user_uuid=?,name=?,address=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
let find_uuid = function(uuid) {
    let sql = `select * from agencies where uuid = '${uuid}'`;
    return query(sql, []);
}
let get_by_uuid = function(uuid) {
    let sql = `select * from agencies where user_uuid = '${uuid}'`;
    return query(sql, []);
}
let update = function(uuid, name, address, timestamp) {
    let sql = `update agencies set time_update='${timestamp}', name='${name}', address='${address}' where uuid = '${uuid}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    find_uuid: find_uuid,
    update: update,
    get_by_uuid: get_by_uuid,
}