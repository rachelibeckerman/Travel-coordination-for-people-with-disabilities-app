import { LoginService } from "../services/loginService.js"
// import jwt from 'jsonwebtoken';

// function generateJWT(user) {
    

//     const secretKey = process.env.ACCESS_TOKEN_SECRET;
//     const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
//     return token;
// }


export class LoginController {
    async login(req, res, next) {
        try {
            if (req.body) {
                const loginService = new LoginService();
                const resultItems = await loginService.getUser(req.body);
                return res.status(200).json({ data: resultItems });
            }
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }



        //const { username, password } = req.body;
        // try {
        //     const loginService = new LoginService();
        //     const user = await loginService.getUser(req.body);
        //     console.log("🥰🥰user: " + JSON.stringify(user));
        //     const token = generateJWT(user); // פונקציה זו צריכה להיווצר
        //     res.json({ token });
        // } catch (err) {
        //     console.error(err);
        //     res.status(400).json({ message: 'שם משתמש או סיסמה לא נכונים' });
        // }
    }



}