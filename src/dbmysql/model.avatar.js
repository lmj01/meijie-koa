
let query = require('./mysql');

let users = 
`
create table if not exists avatar (
    id INT NOT NULL AUTO_INCREMENT,
    base64 longblob COMMENT '图片',
    nickname VARCHAR(40) NOT NULL COMMENT '昵称',
    PRIMARY KEY(id)
);
`;

query(users, []);

let insert = function(value) {
    let sql = 'insert into avatar set base64=?,nickname=?;';
    return query(sql, value);
}

let remove = function(id) {
    let sql = `delete from avatar where id = '${id}'`;
    return query(sql, []);
}

let find = function(nickname) {
    let sql = `select * from avatar where nickname = '${nickname}'`;
    return query(sql, []);
}


module.exports = {
    insert: insert,
    find: find, 
    remove: remove,
}