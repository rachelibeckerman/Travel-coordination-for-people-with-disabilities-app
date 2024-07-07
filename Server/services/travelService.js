import { executeQuery } from '../dataAccess/db.js';
import { addItemQuery, getByParamsQuery, getTravelsQuery } from '../dataAccess/query.js'
import { getMinimalDistance } from './googleMaps.js'

export class TravelService {
    async addTravel(params) {

        const rideObj = {
            userId: params.userId,
            date: params.date,
            startPoint: [parseFloat(params.latStart), parseFloat(params.lngStart)],
            destinationPoint: [parseFloat(params.latDestination), parseFloat(params.lngDestination)],
            isAvailable: `${params.isAvailable}`,
            additionalSeats: params.additionalSeats,
            userType: params.userType
        }

        const rideValues = [
            rideObj.userId,
            rideObj.date.replace('T', ' ').slice(0, -5),
            rideObj.startPoint[0],
            rideObj.startPoint[1],
            rideObj.destinationPoint[0],
            rideObj.destinationPoint[1],
            rideObj.isAvailable,
            rideObj.additionalSeats,
            rideObj.userType
        ];
        const queryItems = addItemQuery('travels', rideObj);
        const result = await executeQuery(queryItems, rideValues)
        return result;
    }

    async handlePassengerTravel(params) {
        try {
            const resultAddTravel = this.addTravel(params);
            let location = {
                latStart: params.latStart,
                lngStart: params.lngStart,
                latDestination: params.latDestination,
                lngDestination: params.lngDestination
            }
            const resultGetClosestTravels = this.getCloseTravels(location);
            const resultObj = {
                id: resultAddTravel.insertId,
                closestTravels: resultGetClosestTravels
            }
            return resultObj
        } catch (error) {
            console.log(error);
        }
    }

    async getCloseTravels(params) {
        try {
            const date = new Date(params.date);
            const Day = date.getDate();
            const Month = date.getMonth() + 1; 
            const Year = date.getFullYear();
            const dateString = `${Year}-${Month}-${Day}`;
            const paramsObj = {
                userType: 'driver',
                date: dateString
            }

            const queryItems = getByParamsQuery("travels", paramsObj);
            const destinations = await executeQuery(queryItems, Object.values(paramsObj));
            const destinationsS = destinations.map(obj => ({
                id: obj.id,
                lat: obj.startPoint.x,
                lng: obj.startPoint.y
            }));
            const destinationsD = destinations.map(obj => ({
                id: obj.id,
                lat: obj.destinationPoint.x,
                lng: obj.destinationPoint.y
            }));
            const origins = params
            const originsS = {
                lat: origins.latStart,
                lng: origins.lngStart
            }
            const originsD = {
                lat: origins.latDestination,
                lng: origins.lngDestination
            }

            const closestTravel = await getMinimalDistance([originsS], [originsD], destinationsS, destinationsD, process.env.LIMIT_DISTANCE);
            const queryGetTravel = getByParamsQuery('travels', { "id": destinations[0].id });
            const idArr = closestTravel.map(travel => destinations[travel].id)
            const getTravelRes = []
            for (let i = 0; i < idArr.length; i++) {
                const result = await executeQuery(queryGetTravel, [idArr[i]]);
                getTravelRes[i] = result[0]
            }
            return getTravelRes;

        } catch (error) {
            console.log(error);
        }

    }

    async getTravels(params) {
        const queryItems = getByParamsQuery("travels", params);
        const result = await executeQuery(queryItems, Object.values(params));
        return result;
    }

}




