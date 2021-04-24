
import jwtSimple from 'jwt-simple';
import jwtConfig, {JwtConfig} from '../../config/jwt';

export function encode(identity:string) {
    let expiresTime = Date.now() + (<JwtConfig>jwtConfig).expiresTime;
    let payload = {
        exp: expiresTime,
        uuid: identity
    }
    return jwtSimple.encode(payload, jwtConfig.secret);
}

export function decode(authorization: string) {
    let payload = jwtSimple.decode(authorization.split(' ')[1], jwtConfig.secret);
    console.log('decode token -- ', payload);
    return payload;
}
