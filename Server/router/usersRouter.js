import express from "express";
import {UsersController} from '../controllers/usersController.js'
const usersRouter = express.Router();

const usersController = new UsersController();

usersRouter.get("/:username", usersController.getByUsername)

export {
    usersRouter
}