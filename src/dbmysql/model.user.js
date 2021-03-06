
let query = require('./mysql');

let users = 
`
create table if not exists users (
    id INT NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(40) NOT NULL COMMENT '用户名',
    email VARCHAR(40) NOT NULL COMMENT '邮件',
    password VARCHAR(40) NOT NULL COMMENT '密码',
    uuid VARCHAR(60) NOT NULL COMMENT 'uuid',
    language VARCHAR(2) NOT NULL COMMENT 'language, en, cn',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(users, []);

let insert = function(value) {
    let sql = 'insert into users set nickname=?,email=?,password=?,uuid=?,language=?,time_create=?,time_update=?;';
    return query(sql, value);
}

let find = function(email) {
    let sql = `select * from users where email = '${email}'`;
    return query(sql, []);
}


let findByUuid = function(uuid) {
    let sql = `select * from users where uuid = '${uuid}'`;
    return query(sql, []);
}

let update_language = (uuid, language)=>{
    let sql = `update users set language='${language}' where uuid = '${uuid}'`;
    return query(sql, []);
}

module.exports = {
    insert: insert,
    findByUuid: findByUuid,
    find: find,
    update_language: update_language,
}