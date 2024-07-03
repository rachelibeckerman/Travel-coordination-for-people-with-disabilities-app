import express from "express";
import {RegisterController} from '../controllers/registerController.js'
const registerRouter = express.Router();

const registercontroller = new RegisterController();

registerRouter.post("/", registercontroller.register)

export {
    registerRouter
}