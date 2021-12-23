import { query } from './mysql';
import { Query } from 'mysql';

export interface IUser {
    id: number, 
    nickname: string,
    email: string,
    password: string,
    uuid: string,
    language: string,
    time_create: Date,
    time_update: Date,
}

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

export function userInsert(value: Array<string>): Promise<Query> {
    let sql = 'insert into users set nickname=?,email=?,password=?,uuid=?,language=?,time_create=?,time_update=?;';
    return query(sql, value);
}

export function userFind(email:string): Promise<Query> {
    let sql = `select * from users where email = '${email}'`;
    return query(sql, []);
}

export function userFindByUuid(uuid: string): Query {
    let sql = `select * from users where uuid = '${uuid}'`;
    return query(sql, []);
}

export function userUpdateLanguage(uuid:string, language:string): Query {
    let sql = `update users set language='${language}' where uuid = '${uuid}'`;
    return query(sql, []);
}