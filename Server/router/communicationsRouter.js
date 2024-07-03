import express from "express";
import {CommunicationsController} from '../controllers/communicationsController.js'
const communicationsRouter = express.Router();

const communicationsController = new CommunicationsController();

communicationsRouter.post("/", communicationsController.addCommunication);
communicationsRouter.put("/:id", communicationsController.updateCommunication);
communicationsRouter.get("/:id", communicationsController.getCommunicationById)
communicationsRouter.get("/", communicationsController.getCommunications)


export {
    communicationsRouter
}