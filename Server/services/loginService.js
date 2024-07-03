import { executeQuery } from '../dataAccess/db.js';
import { getByParamsQuery } from '../dataAccess/query.js'
import { sha256 } from 'js-sha256'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

//  require('dotenv').config();
// const jwt = require('jsonwebtoken');
export class LoginService {

  async getUser(params) {
    console.log("params: " + params);
    // const hashPswd = sha256(params.password);
    // const userExistObj = { username: params.username, password: hashPswd }
    const queryUserExist = getByParamsQuery('passwords', params);
    const userExistRes = await executeQuery(queryUserExist, Object.values(params));
    if (userExistRes.length != 0) {
      console.log("jjjj")
      const queryGetUser = getByParamsQuery('users', { "username": params.username });
      const getUserRes = await executeQuery(queryGetUser, [params.username]);
      if (getUserRes.length != 0) {
        console.log("befor token")
        console.log("getUserRes[0]: " + JSON.stringify(getUserRes[0]))
        const accessToken = jwt.sign({ userId: getUserRes[0].id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        // const refreshToken = jwt.sign({ userId: getUserRes[0].userId }, refreshTokenSecret, { expiresIn: '1d' });
        console.log("after token")
        return { user: getUserRes[0], accessToken: accessToken };
      }
      else {
        console.log("data error");
        throw { error: 'User not found or invalid credentials' };
      }

      // return getUserRes[0];

    } else {
      console.log("error in c login server");
      throw { error: 'User not found or invalid credentials' };
    }

  }

}

