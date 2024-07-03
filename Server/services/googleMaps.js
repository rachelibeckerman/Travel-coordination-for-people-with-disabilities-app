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

export const getMinimalDistance = async (originsS, originsD, destinationsS, destinationsD) => {
    const distanceMatrixStart = await getDistanceMatrix(originsS, destinationsS);
    const distanceMatrixDestination = await getDistanceMatrix(originsD, destinationsD);
    // console.log("distanceMatrixStart.row[0]")
    // console.log(distanceMatrixStart.rows[0].elements)
    // console.log("distanceMatrixDestination.row[0]")
    // console.log(distanceMatrixDestination.rows[0].elements)
    let minimalDistance = Number.MAX_VALUE;
    let minimalDistanceIdx = null;

    for (let i = 0; i < distanceMatrixStart.rows[0].elements.length; i++) {
        let distance = distanceMatrixStart.rows[0].elements[i].distance.value;
        distance += distanceMatrixDestination.rows[0].elements[i].distance.value;
        if (distance < minimalDistance) {
            minimalDistance = distance;
            minimalDistanceIdx = i;
        }
    }
    // console.log(minimalDistance)
    return minimalDistanceIdx
}