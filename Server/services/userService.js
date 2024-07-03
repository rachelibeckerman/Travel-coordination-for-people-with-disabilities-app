import { executeQuery } from '../dataAccess/db.js';
import { getByParamsQuery } from '../dataAccess/query.js'

export class UserService {
    // async addUser(object, table) {
    //     const queryItems = getByParamsQuery(table);
    //     const obj = Object.values(object)
    //     console.log(obj)
    //     //const result = await executeQuery(queryItems, [user.name, user.username, user.email, user.phone, user.website, user.isActive]);
    //     const result = await executeQuery(queryItems, obj)
    //     return result;
    // }

    async getUserById(tableName, id) {
        const query = getByIdQuery(tableName);
        const result = await executeQuery(query, [id]);
        return result;
    }
    
    async getUserByParams(params) {
        const queryGetUser = getByParamsQuery('users', params);
        const getUserRes = await executeQuery(queryGetUser, Object.values(params));
        return getUserRes;
    }
    async getByUsername(params) {
        console.log("in user service")
        const queryItems = getByParamsQuery("users", params);
        console.log("queryItems: " + queryItems)
        console.log("username:❤️❤️❤️❤️❤️❤️❤️ " + params.username)
        const result = await executeQuery(queryItems, [params.username]);
        console.log("result: " + result)
        return result;
    }
}