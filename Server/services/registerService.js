import { executeQuery } from '../dataAccess/db.js';
import { addItemQuery ,getByParamsQuery  } from '../dataAccess/query.js'

import { sha256 } from 'js-sha256'

export class RegisterService {
    async addUser(params) {
        const hashPswd = sha256(params.password);
        const userExistObj = { username: params.username, password: hashPswd }
        const queryUserExist = getByParamsQuery('passwords', userExistObj);
        const userExistRes = await executeQuery(queryUserExist, Object.values(userExistObj));
        if (userExistRes.length == 0) {
            delete params.password;
            const queryUser = addItemQuery('users', params);
            const resultUser = await executeQuery(queryUser, Object.values(params))
            const queryPswd = addItemQuery('passwords', userExistObj);
            const resultPswd = await executeQuery(queryPswd, Object.values(userExistObj))
            return resultUser;
        }
        else {
            console.log("err in register service")
            throw ("")
        }
    }
}