import { CommunicationsService } from "../services/communicationsService.js"

export class CommunicationsController {

    async addCommunication(req, res, next) {
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = await communicationsService.addCommunication(req.body);
            res.json({ data: resultItem.insertId });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async updateCommunication(req, res, next) {
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = await communicationsService.updateCommunication(req.params.id, req.body);
            res.json({ data: resultItem.status });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async getCommunicationByParams(req, res, next) {
        try {
            const communicationsService = new CommunicationsService();
            const resultItem = Object.keys(req.query).length != 0 ?
                await communicationsService.getCommunicationByParams(req.query) :
                await communicationsService.getCommunicationByParams({ id: req.params.id });
            res.json({ data: resultItem });
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
            const resultItems = await communicationsService.getCommunications(req.query);
            res.json({ data: resultItems });
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

}