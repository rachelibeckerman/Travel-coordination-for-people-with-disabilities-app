import { UserService } from "../services/userService.js"

export class UsersController {
    async getByUsername(req, res, next) {
        try {
            console.log("in user controller")
            const usersService = new UserService();
            console.log("params " + JSON.stringify(req.params))
            const resultItem = await usersService.getByUsername(req.params);
            return res.status(200).json({ status: 200, data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getUserById(req, res, next) {
        try {
            const userService = new UserService()
            const resultItem = await userService.getById('users', req.params.id);
            return res.status(200).json(resultItem[0]);
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getUserByParams(req, res, next) {
        try {
            const usersService = new UsersService();
            const resultItems = await usersService.getUserByParams(req.body);
            return res.status(200).json({ data: resultItems });

        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }



}