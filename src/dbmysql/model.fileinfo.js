
let query = require('./mysql');

/*
上传文件信息
 */

let fileinfo = 
`
create table if not exists fileinfo (
    id INT NOT NULL AUTO_INCREMENT,
    description VARCHAR(40) COMMENT '描述',
    filename VARCHAR(40) NOT NULL COMMENT '文件名',
    type VARCHAR(40) NOT NULL COMMENT '类型',
    size INT NOT NULL COMMENT '文件大小,字节数目',
    path VARCHAR(120) NOT NULL COMMENT '路径',
    uuid VARCHAR(40) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(fileinfo, []);

add = function(value) {
    let sql = 'insert into fileinfo set filename=?,type=?,path=?,size=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
get = function(uuid) {
    let sql = `select * from fileinfo where uuid = '${uuid}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    get: get,
}