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

    async getCommunicationById(req, res, next) {
        console.log(req.params.id)
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = await communicationsService.getCommunication({ id: req.params.id });
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
        try {
            const communicationsService = new CommunicationsService();
            //const resultItems = Object.keys(req.query).length != 0 ? await commentService.getByParams('comments', req.query) : await commentService.getAll('comments')
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