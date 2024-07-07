import { RegisterService } from "../services/registerService.js"


export class RegisterController {

    async register(req, res, next) {
        try {
            if (req.body) {
                console.log("body on register controller:" );
                console.log(req.body)
                const registerService = new RegisterService();
                const resultItem = await registerService.addUser(req.body);
                return res.cookie("token", resultItem.token, { httpOnly: true, secure: true }).json({ id: resultItem.insertId });
            }
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }
}