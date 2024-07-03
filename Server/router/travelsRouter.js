import express from "express";
import { TravelsController } from '../controllers/travelscontroller.js'

const travelsRouter = express.Router();

const travelscontroller = new TravelsController();

//travelsRouter.get("/nearbysearch/:location", travelscontroller.getTravelBySearch)
travelsRouter.post("/closestTravels", travelscontroller.handlePassengerTravel)
travelsRouter.get("/closestTravels/:location", travelscontroller.getClosestTravels)
travelsRouter.get("/", travelscontroller.getTravels)
travelsRouter.post("/", travelscontroller.addTravel)


export {
    travelsRouter
}