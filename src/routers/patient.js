const router = require('koa-router')();
const logger = require('../middlewares/logger');
const modelPatient = require('../dbmysql/model.patient');
const moment = require('moment');
const uuidv1 = require('uuid/dist/v1');
const toRes = require('../helpers/result').toRes;

function toV1(src) {
    return {
        name: src.name,
        sex: src.sex,
        birthday: src.birthday,
        features: src.features,
        methods: src.methods,
        phone: src.phone,
        email: src.email,
        uuid: src.uuid, 
        mark: src.mark,
        address: src.address,
        agency: src.agency,   
        time_update: src.time_update,
    }
}

router.post('/api/v1/patient/add', async ctx => {
    let {name, sex, birthday, features, methods, phone, email, agency, address, user_uuid} = ctx.request.body;
    features = features.join(',');
    methods = methods.join(',');
    await modelPatient.add([name, sex, birthday, features, methods, phone, email, agency, address, user_uuid, uuidv1(),
        moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'), '0'])
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = toRes(0, 'add success');
            } else {
                ctx.body = toRes(1, 'add failure!');
                logger.info('patient add:', name, sex, birthday, features, methods, phone, email);
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error('patient add ',err);
        })  
});

router.post('/api/v1/patient/get', async ctx => {
    let {user_uuid, page, size} = ctx.request.body;
    await modelPatient.get_by_uuid(user_uuid, page, size)
        .then(result=>{
            let res = result.data, count = result.count;
            if (res.length > 0) {
                let data = [];                
                for (let i in res) {
                    data.push(toV1(res[i]));
                }
                ctx.body = toRes(0, 'get success');
                ctx.body.count = count;
                ctx.body.data = data;
            } else {
                ctx.body = toRes(1, 'no patient data!');
                logger.info('patient get:', user_uuid, page, size);
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error('patient get ',err);
        })  
});

router.post('/api/v1/patient/find', async ctx => {
    let {uuid} = ctx.request.body;
    await modelPatient.find_by_uuid(uuid)
        .then(res=>{
            if (res.length > 0) {
                ctx.body = toRes(0, 'find success');
                ctx.body.data = toV1(res[0]);
            } else {
                ctx.body = toRes(1, 'no patient data!');
                logger.info('patient find:', user_uuid, page, size);
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error('patient find ',err);
        })  
});

router.post('/api/v1/patient/update/features', async ctx => {
    let {uuid, str} = ctx.request.body;
    await modelPatient.update_features(uuid, str)
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = toRes(0, 'update features success');
            } else {
                ctx.body = toRes(1, 'update features failure');
                logger.info('patient features update:', uuid, str);
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error('patient features add ',err);
        })  
});

router.post('/api/v1/patient/update/methods', async ctx => {
    let {uuid, str} = ctx.request.body;
    await modelPatient.update_methods(uuid, str)
        .then(res=>{
            if (res.affectedRows == 1) {
                ctx.body = toRes(0, 'update methods success');
            } else {
                ctx.body = toRes(1, 'update methods failure!');
                logger.info('patient methods update:', uuid, str);
            }
        }).catch(err=>{
            ctx.body = toRes(-1, 'backend has exception');
            logger.error('patient update methods ',err);
        })  
});


module.exports = router;