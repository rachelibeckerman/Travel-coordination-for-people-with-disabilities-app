import React, { useEffect, useState } from "react";
import { get, post } from "../GeneralRequest"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./ShowsMatchTravels.css"
import io from 'socket.io-client';


const URL = 'http://localhost:8080';

function ShowsMatchTravels(props) {

    let {originTravel,hideSidebar ,socket,callback} = props;
    if(originTravel!=null){
    const [matchTravels, setMatchTravels] = useState([])
    
    let keyCounter = 0;

    let location = {
        latStart: originTravel.latStart,
        lngStart: originTravel.lngStart,
        latDestination: originTravel.latDestination,
        lngDestination: originTravel.lngDestination
    }
    location = JSON.stringify(location)


    useEffect(() => {
        console.log("in ShowsMatchTravels useefect")
        async function fetchData() {
            const response = await get(`${URL}/travels/closestTravels/${location}`);
            setMatchTravels(response.data)
        }
        try {
            fetchData()
        }
        catch (err) {
            console.error("error: " + err)
        }

    }, [])


    const header = () => {
        return (
            <>
                <h1>match travels</h1>
            </>
        )
    }
    const SendJoinReqForDriver = async (travelDriverId) => {
        
        const communicationObj = {
            travelPassengerId : originTravel.travelId,
            travelDriverId :travelDriverId,
        }

        try{
            const response = await post(`${URL}/communications`,JSON.stringify(communicationObj));
            console.log("response communications" ,response)
            console.log("passenger_join" ,{room : travelDriverId ,msg: response.data})
            socket.emit('passenger_join',{room : travelDriverId ,msg: response.data})
            socket.on("travel_confirmed", (originTravel) => {
                console.log("travel_confirmed", originTravel);
                callback(originTravel)
            })
            hideSidebar()
        }
        catch(err){
           
            console.log(`ERROR ${err}`);
        }
    }

    const listTemplate = (travel) => {
        keyCounter++;
        return (
            <div className="matchTravel">
                <div>Tryout starts at: {travel.date}</div>
                <div>Amount of additional places: {travel.additionalSeats}</div>
                <button onClick={()=>SendJoinReqForDriver(travel.id)}>Send join request for driver</button>
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
