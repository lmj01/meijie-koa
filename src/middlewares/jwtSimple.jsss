
const jwtSimple = require('jwt-simple');
const jwtConfig = require('../../config/jwt');

function encode(identity) {
    let payload = {
        exp: Date.now() + jwtConfig.expiresTime,
        uuid: identity
    }
    return jwtSimple.encode(payload, jwtConfig.secret);
}

function decode(authorization) {
    let payload = jwtSimple.decode(authorization.split(' ')[1], jwtConfig.secret);
    console.log('decode token -- ', payload);
    return payload;
}

module.exports = {
    encode: encode,
    decode: decode,
}