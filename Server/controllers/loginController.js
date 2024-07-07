import { LoginService } from "../services/loginService.js"


export class LoginController {
    async login(req, res, next) {
        try {
            if (req.body) {
                const loginService = new LoginService();
                const resultItems = await loginService.getUser(req.body);
                return res.cookie("token", resultItems.token, { httpOnly: true, secure: true }).json({ data: resultItems });
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