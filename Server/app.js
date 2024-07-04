import express from 'express';
import cors from 'cors';
import { loginRouter } from './router/loginRouter.js'
import { registerRouter } from './router/registerRouter.js'
import { travelsRouter } from './router/travelsRouter.js'
import { communicationsRouter } from './router/communicationsRouter.js'
import { logErrors } from './middleware/logError.js'
// import {usersRouter} from './router/usersRouter.js'
import jwt from 'jsonwebtoken';
const app = express();
app.use(cors());
app.use(express.json());

//============================================================================


// const verifyJWT = (req, res, next) => {
//   const token = req.headers['x-access-token'];
//   if (!token) {
//     return res.status(401).json({ message: 'אין טוקן גישה' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'טוקן גישה לא חוקי' });
//   }
// };

// שימוש ב-middleware בכל בקשות ל- /api
// app.use('/tokenAuth', verifyJWT);
//============================================================================

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/travels', travelsRouter);
app.use('/communications', communicationsRouter);
app.use(logErrors);
// app.use('/users',usersRouter);

app.listen(8080, (err) => {
    if (err) console.error(err);
    console.log("Server listening on PORT", 8080);
});
