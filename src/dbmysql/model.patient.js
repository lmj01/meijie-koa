
let query = require('./mysql');
const logger = require('../middlewares/logger');
/*
姓名
性别， 0未知1女2男
出生年月，必填
医生-医疗机构， 必填
病理特征，必选，如拥挤
矫治方法，
电话，
邮件，
agency，机构，用户下面的agency地址
user_uuid，用户的uuid
uuid,
创建时间，
更新时间，
标记，即是否标记位
 */

let patient = 
`
create table if not exists patient (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL COMMENT '姓名',
    address VARCHAR(40) NOT NULL COMMENT '地址',
    sex VARCHAR(1) NOT NULL COMMENT '性别',
    birthday VARCHAR(40) NOT NULL COMMENT '出生年月',
    features VARCHAR(60) NOT NULL COMMENT '病理特征',
    methods VARCHAR(60) NOT NULL COMMENT '矫治方法',
    phone VARCHAR(60) NOT NULL COMMENT '电话',
    email VARCHAR(60) NOT NULL COMMENT '邮件',
    agency VARCHAR(60) NOT NULL COMMENT '机构地址',
    user_uuid VARCHAR(60) NOT NULL COMMENT 'user uuid',
    uuid VARCHAR(60) NOT NULL COMMENT 'uuid',
    time_create TIMESTAMP COMMENT '创建时间',
    time_update TIMESTAMP COMMENT '更新时间',
    mark VARCHAR(1) COMMENT '标记',
    PRIMARY KEY(id)
);
`;

query(patient, []);

add = function(value) {
    let sql = 'insert into patient set name=?,sex=?,birthday=?,features=?,methods=?,phone=?,email=?,agency=?,address=?,user_uuid=?,uuid=?,time_create=?,time_update=?,mark=?;';
    return query(sql, value);
}

remove = function(uuid) {
    let sql = `delete from patient where uuid = '${uuid}'`;
    return query(sql, []);
}

find_by_uuid = function(uuid) {
    let sql = `select * from patient where uuid = '${uuid}'`;
    return query(sql, []);
}

get_by_uuid = function(uuid, page, size) {
    if (page < 1) page = 1;
    if (size < 1) size = 10;
    let from = (page-1) * size, to = from + size;
    let sql = `select * from patient where user_uuid = '${uuid}' order by time_update limit ${from},${to}`;
    let sql2 = `select COUNT(*) from patient where user_uuid = '${uuid}'`;
    return Promise.resolve(query(sql, []))
        .then(res=>{
            return Promise.resolve(query(sql2, []))
                .then(res2=>{
                    return Promise.resolve({data: res, count: res2[0]['COUNT(*)']})
                })
        })
}

update_features = function(uuid, features) {
    let sql = `update patient set features='${features}' where uuid = '${uuid}'`;
    return query(sql, []);
}

update_methods = function(uuid, methods) {
    let sql = `update patient set methods='${methods}' where uuid = '${uuid}'`;
    return query(sql, []);
}

module.exports = {
    add: add, 
    find_by_uuid: find_by_uuid,
    get_by_uuid: get_by_uuid,
    update_features: update_features,
    update_methods: update_methods,
}