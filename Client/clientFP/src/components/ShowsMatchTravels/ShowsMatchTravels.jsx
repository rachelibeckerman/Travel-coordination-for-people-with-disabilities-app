import React, { useEffect, useState } from "react";
import { get, post } from "../GeneralRequest"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./ShowsMatchTravels.css"
import io from 'socket.io-client';


const URL = 'http://localhost:8080';

function ShowsMatchTravels(props) {

    let { originTravel, hideSidebar, socket, callback } = props;
    if (originTravel != null) {
        const [matchTravels, setMatchTravels] = useState([])

        let keyCounter = 0;

        useEffect(() => {
            async function fetchData() {
                let tmp = []
                const response = await get(`${URL}/travels/closestTravels/${JSON.stringify(originTravel)}`);
                tmp = response.data
                for (let i = 0; i < tmp.length; i++) {
                    const [start, destination] = await geocodeAddress(tmp[i].startPoint, tmp[i].destinationPoint);
                    tmp[i] = { ...tmp[i], startLocationTxt: start, destinationLocationTxt: destination };
                }
                setMatchTravels(tmp)
            }
            try {
                fetchData()
            }
            catch (err) {
                console.error("error: " + err)
            }

        }, [])

        const geocodeAddress = async (startPoint, destinationPoint) => {
            try {
                const startPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${startPoint.x},${startPoint.y}&language=en&key=API_KEY`);
                const startPointData = await startPointResponse.json();
                const destinatioPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPoint.x},${destinationPoint.y}&language=en&key=API_KEY`);
                const destinationPointData = await destinatioPointResponse.json();
                if (startPointData.results && startPointData.results.length > 0 && destinationPointData.results && destinationPointData.results.length > 0) {
                    return [startPointData.results[0].formatted_address, destinationPointData.results[0].formatted_address]
                } else {
                    throw ("'Address not found'")
                }
            } catch (error) {
                console.error(error);
            }
        }
        const header = () => {
            return (
                <>
                    <h1>match travels</h1>
                </>
            )
        }
        const SendJoinReqForDriver = async (travelDriverId) => {

            const communicationObj = {
                travelPassengerId: originTravel.travelId,
                travelDriverId: travelDriverId,
            }

            try {
                const response = await post(`${URL}/communications`, JSON.stringify(communicationObj));
                console.log("passenger_join", { room: travelDriverId, msg: response.data })
                socket.emit('passenger_join', { room: travelDriverId, msg: response.data })
                socket.on("travel_confirmed", (originTravel) => {
                    console.log("travel_confirmed", originTravel);
                    callback(originTravel)
                })
                hideSidebar()
            }
            catch (err) {
                console.log(`ERROR ${err}`);
            }
        }

        const listTemplate = (travel) => {
            keyCounter++;
            return (
                <div className="matchTravel">
                    <div className='travelItem'>
                        <h2>Travel Info</h2>
                        <h3>from: {travel.startLocationTxt}</h3>
                        <h3>to: {travel.destinationLocationTxt}</h3>
                        <h3>at: {travel.date.replace('T', ' ').substring(0, travel.date.indexOf('.'))}</h3>
                        <h3>Additional seats: {travel.additionalSeats}</h3>
                        <button onClick={() => SendJoinReqForDriver(travel.id)}>Send join request for driver</button>
                    </div>
                </div>
            );
        };

        return (
            <>
                <DataView key={keyCounter} value={matchTravels} itemTemplate={listTemplate} header={header()} />
            </>
        );
    }

}

export default ShowsMatchTravels;
