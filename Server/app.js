import express from 'express';
import cors from 'cors';
import { loginRouter } from './router/loginRouter.js'
import { registerRouter } from './router/registerRouter.js'
import { travelsRouter } from './router/travelsRouter.js'
import { communicationsRouter } from './router/communicationsRouter.js'
import { logErrors } from './middleware/logError.js'

const app = express();
app.use(cors());
app.use(express.json());


app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/travels', travelsRouter);
app.use('/communications', communicationsRouter);
app.use(logErrors);

app.listen(8080, (err) => {
    if (err) console.error(err);
    console.log("Server listening on PORT", 8080);
});
