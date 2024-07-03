import { TravelService } from "../services/travelService.js"

export class TravelsController {

    async addTravel(req, res, next) {
        console.log(req.body)
        try {
            console.log("in travel controller :: addTravel")
            const travelService = new TravelService();
            const resultItem = await travelService.addTravel(req.body);
            res.status(200).json({ status: 200, data: resultItem.insertId });
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
            console.log("in travel controller :: getTravel")
            console.log("req.query "+req.query)
            const travelService = new TravelService();
            const resultItem = await travelService.getTravels(req.query);
            res.status(200).json({ status: 200, data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }
    // async getAllTravels(req, res, next) {
    //     try {
    //         console.log("in travel controller :: getTravel")
    //         const travelService = new TravelService();
    //         const resultItem = await travelService.getAllTravels(req.query);
    //         res.status(200).json({ status: 200, data: resultItem });
    //     }
    //     catch (ex) {
    //         const err = {}
    //         err.statusCode = 500;
    //         err.message = ex;
    //         next(err)
    //     }
    // }
    // async getTravelBySearch(req, res, next) {
    //     console.log("get Travel By Search function travelscontroller")
    //     console.log(req.params.location);
    //     const result = await travelService.addTravel(req.params);
    //     console.log('result of add travel in search: ')
    //     console.log(result)
    //     const travelService = new TravelService();
    //     const resultItem = await travelService.getTravelBySearch(req.params);
    //     res.status(200).json({ status: 200, data: resultItem });

    // }
    async handlePassengerTravel(req,res,next) {
        try {
            console.log("in travel controller :: handlePassengerTravel")
            const travelService = new TravelService();
            console.log("req.body")
            console.log(req.body)
            const resultItem = await travelService.handlePassengerTravel(req.body);
            console.log("handlePassengerTravel in controller :: resultItem")
            console.log(resultItem)
            res.status(200).json({ status: 200, data: resultItem  });
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
            res.status(200).json({ status: 200, data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }

    }

    //example
    /*
    {
origins: [{lat: 55.93, lng: -3.118}, 'Greenwich, England'],
destinations: ['Stockholm, Sweden', {lat: 50.087, lng: 14.421}],
travelMode: 'DRIVING',
drivingOptions: {
departureTime: new Date(Date.now() + N),  // for the time N milliseconds from now.
trafficModel: 'optimistic'
}
}
    */
    // async getByUsername(req, res,next) {
    //     try {
    //         console.log("in user controller")
    //         const usersService = new UsersService();
    //         console.log("params " +JSON.stringify(req.params))
    //         const resultItem = await usersService.getByUsername(req.params);
    //         res.status(200).json({ status: 200, data: resultItem });
    //     }
    //     catch (ex) {
    //         const err = {}
    //         err.statusCode = 500;
    //         err.message = ex;
    //         next(err)
    //     }
    // }

}