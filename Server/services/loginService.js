import { executeQuery } from '../dataAccess/db.js';
import { getByParamsQuery } from '../dataAccess/query.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config';


export class LoginService {

  async getUser(params) {
    const queryUserExist = getByParamsQuery('passwords', params);
    const userExistRes = await executeQuery(queryUserExist, Object.values(params));
    if (userExistRes.length != 0) {
      const queryGetUser = getByParamsQuery('users', { "username": params.username });
      const getUserRes = await executeQuery(queryGetUser, [params.username]);
      if (getUserRes.length != 0) {
        const token = jwt.sign({ userId: getUserRes[0].id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return { user: getUserRes[0], token };
      }
      else {
        throw { error: 'User not found or invalid credentials' };
      }
    } else {
      throw { error: 'User not found or invalid credentials' };
    }

  }

}

