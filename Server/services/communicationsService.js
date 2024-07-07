import { executeQuery } from '../dataAccess/db.js';
import { getByParamsQuery, addItemQuery, updateItemQuery } from '../dataAccess/query.js'
import { TravelService } from './travelService.js';

export class CommunicationsService {
    async addCommunication(params) {
        const queryItems = addItemQuery('communication', params);
        const result = await executeQuery(queryItems, Object.values(params))
        return result;
    }

    async updateCommunication(id, updateItem) {
        if (updateItem.status == 2) {
            const communication = await this.getCommunicationByParams({ id });
            const paramsQuery = {
                params: { status: 3 },
                whereParams: { travelDriverId: communication.driverTravel[0].id }
            }
            const queryItems = updateItemQuery('communication', paramsQuery);
            await executeQuery(queryItems, ['3', communication.driverTravel[0].id])
            const updatTravelItem=updateItemQuery("travels",{params:{isAvailable:0},whereParams:{id:communication.driverTravel[0].id}})
            await executeQuery(updatTravelItem, [0, communication.driverTravel[0].id])

        }
        const queryItems = updateItemQuery('communication', { params: updateItem, whereParams: { id } });
        const result = await executeQuery(queryItems, [...Object.values(updateItem), id])
        return result;
    }

    async getCommunicationByParams(params) {
        const queryItems = getByParamsQuery('communication', params);
        const communication = await executeQuery(queryItems, Object.values(params))
        const travelService = new TravelService()
        const passengerTravel = await travelService.getTravels({ id: communication[0].travelPassengerId })
        const driverTravel = await travelService.getTravels({ id: communication[0].travelDriverId })
        return { passengerTravel, driverTravel, id: communication[0].id };
    };

    async getCommunications(query) {
        const queryItems = getByParamsQuery('communication', query);
        const communications = await executeQuery(queryItems, Object.values(query))
        const travelService = new TravelService()
        for (let i = 0; i < communications.length; i++) {
            const passengerTravel = await travelService.getTravels({ id: communications[i].travelPassengerId })
            const driverTravel = await travelService.getTravels({ id: communications[i].travelDriverId })
            communications[i] = {
                id: communications[i].id,
                status: communications[i].status,
                passengerTravel: passengerTravel[0],
                driverTravel: driverTravel[0]
            }
        }
        return communications;
    }

}



