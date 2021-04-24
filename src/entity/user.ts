import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import md5 from 'md5';
import {v1 as uuidv1 } from 'uuid';

export function testUser() {
    let user = new User();
    user.email = 'a@b.com';
    user.password = md5('123');
    user.uuid = uuidv1();
    user.language = 'cn';
    user.time_create = new Date();
    user.time_update = new Date();
    return user;
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 60
    })
    email!: string;

    @Column("text")
    password!: string;

    @Column()
    uuid!: string;

    @Column()
    language!: string;

    @Column()
    time_create!: Date;

    @Column()
    time_update!: Date;
}