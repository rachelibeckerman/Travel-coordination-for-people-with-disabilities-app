import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export const getDistanceMatrix = async (origins, destinations) => {
    const options = {
        origins: origins,
        destinations: destinations,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'optimistic',
        },
    };
    const response = await client.distancematrix({
        params: {
            ...options,
            key: process.env.GOOGLE_MAPS_API_KEY,
        },
    });
    return response.data;
};

export const getMinimalDistance = async (TravelOriginS, TravelOriginD, TravelsDestinationsS, TravelsDestinationsD , limitDistance) => {
    const distanceMatrixStart = await getDistanceMatrix(TravelOriginS, TravelsDestinationsS);
    const distanceMatrixDestination = await getDistanceMatrix(TravelOriginD, TravelsDestinationsD);
    const distanceBetweenOrigin = await getDistanceMatrix(TravelOriginS, TravelOriginD)
    let minimalDistanceIdx = [];
    const distanceArray = [];
    for (let i = 0; i < distanceMatrixStart.rows[0].elements.length; i++) {
        let distance = distanceMatrixStart.rows[0].elements[i].distance.value;
        distance += distanceMatrixDestination.rows[0].elements[i].distance.value;
        distance += distanceBetweenOrigin.rows[0].elements[0].distance.value;
        const distanceDriver = await getDistanceMatrix([TravelsDestinationsS[i]], [TravelsDestinationsD[i]]);
        distanceArray[i] = distance - distanceDriver.rows[0].elements[0].distance.value;
        if (distanceArray[i] < limitDistance) {
            minimalDistanceIdx.push(i);
        }
    }
    return minimalDistanceIdx
}

