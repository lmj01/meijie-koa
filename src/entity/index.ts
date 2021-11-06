import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import {User} from './user';

const connectionOpts: ConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'lmjpassword',
    database: 'koa_meijie',
    entities: [
        User,
    ],
    synchronize: true,
    logging: false,
}

const connection: Promise<Connection> = createConnection(connectionOpts)
// .then((connection: Promise<Connection>) => {

// })
// .catch((error:Object) => {
//     console.error(error)
// })

export default connection;