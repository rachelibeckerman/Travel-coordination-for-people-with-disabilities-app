import { CommunicationsService } from "../services/communicationsService.js"

export class CommunicationsController {

    async addCommunication(req, res, next) {
        console.log("addCommunication")
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = await communicationsService.addCommunication(req.body);
            console.log("addCommunication end")
            res.json({ status: 200, data: resultItem.insertId });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async updateCommunication(req, res, next) {
        console.log(req.body)
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = await communicationsService.updateCommunication(req.params.id, req.body);
            res.json({ status: 200, data: resultItem.status });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getCommunicationByParams(req, res, next) {
        console.log("getCommunicationById in CommunicationsController")
        console.log(req.params.id)
        try {
            const communicationsService = new CommunicationsService();
            console.log("req.body")
            console.log(req.query)
            console.log(req.query.length)
            const resultItem = Object.keys(req.query).length != 0 ?
                await communicationsService.getCommunicationByParams(req.query) :
                await communicationsService.getCommunicationByParams({ id: req.params.id });
            res.json({ status: 200, data: resultItem });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getCommunications(req, res, next) {
        console.log("getCommunications in CommunicationsController")
        try {
            const communicationsService = new CommunicationsService();
            //const resultItems = await commentService.getByParams('comments', req.query) : await commentService.getAll('comments')
            const resultItems = await communicationsService.getCommunications(req.query);
            res.status(200).json({ status: 200, data: resultItems });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

}