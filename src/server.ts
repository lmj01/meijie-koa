import app from './app/app';
import { Connection } from 'typeorm';
import dbConnection from './entity/index';
// import {User, testUser} from './entity/user';

const PORT:number = Number(process.env.PORT) || 3000;

dbConnection.then((conn: Connection) => {
    // let user = testUser();
    // conn.manager.save(user)
    // .then(()=>{
    //     console.log('user has been saved to');
    // })
    app.listen(PORT);
})
.catch((error: Object) => {
    console.error(error);
})