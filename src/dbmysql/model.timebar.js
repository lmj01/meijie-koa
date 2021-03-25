
let query = require('./mysql');

/*
时间条
type: 0初始，1中期，2结束
结束状态可更改为中期状态
 */

let timebar = 
`
create table if not exists timebar (
    id INT NOT NULL AUTO_INCREMENT,
    case_uuid VARCHAR(60) NOT NULL COMMENT 'case-uuid',
    type VARCHAR(40) NOT NULL COMMENT '治疗阶段:0初始1中期2结束',
    createday VARCHAR(40) NOT NULL COMMENT '创建日期',
    uuid VARCHAR(40) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY(id)
);
`;

query(timebar, []);

add = function(value) {
    let sql = 'insert into timebar set case_uuid=?,type=?,createday=?,uuid=?,time_create=?,time_update=?;';
    return query(sql, value);
}
get_by_uuid = function(uuid) {
    let sql = `select * from timebar where case_uuid = '${uuid}' order by createday`;
    return query(sql, []);
}
update_tomiddle = function(uuid, timestamp) {
    let sql = `update timebar set type='2',time_update='${timestamp}' where uuid = '${uuid}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    get_by_uuid: get_by_uuid,
    update_tomiddle: update_tomiddle,
}