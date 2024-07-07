import { TravelService } from "../services/travelService.js"

export class TravelsController {

    async addTravel(req, res, next) {
        try {
            const travelService = new TravelService();
            const resultItem = await travelService.addTravel(req.body);
            res.json({  data: resultItem.insertId });
        }
        
        catch (ex) {
            const err = {}
            
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getTravels(req, res, next) {
        try {
            const travelService = new TravelService();
            const resultItem = await travelService.getTravels(req.query);
            res.json({  data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }
   
    async handlePassengerTravel(req,res,next) {
        try {
            const travelService = new TravelService();
            const resultItem = await travelService.handlePassengerTravel(req.body);
            res.json({data: resultItem  });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getClosestTravels(req, res, next) {
       
        try {
            const travelService = new TravelService();
            const resultItem = await travelService.getCloseTravels(JSON.parse(req.params.location));
            res.json({ data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }

    }


}