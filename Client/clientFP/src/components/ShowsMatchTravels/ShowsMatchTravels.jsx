import React, { useEffect, useState } from "react";
import { get, post } from "../GeneralRequest"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./ShowsMatchTravels.css"
import io from 'socket.io-client';


const URL = 'http://localhost:8080';

function ShowsMatchTravels(props) {

    let {originTravel ,socket} = props;
    const [matchTravels, setMatchTravels] = useState([])
    let keyCounter = 0;

    console.log("in ShowsMatchTravels component")
    console.log("baseTravel= " + JSON.stringify(originTravel))

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
            setMatchTravels([response.data])
        }
        try {
            
            fetchData()
        }
        catch (err) {
            console.error("error: " + err)
        }

    }, [])


    // const geocodeAddress = async (latitude, longitude) => {
    //                 try {
    //                     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc`);
    //                     const data = await response.json();
    //                     if (data.results && data.results.length > 0) {
    //                         console.log("data.results[0].formatted_address "+data.results[0].formatted_address)
    //                        return data.results[0].formatted_address
    //                         // console.log("address "+address)
    //                         // setAddress(data.results[0].formatted_address);
    //                     } else {
    //                         throw("'Address not found'")
    //                         // setAddress('Address not found');
    //                     }
    //                 } catch (error) {
    //                     console.error(error);
    //                     setAddress('Error retrieving address');
    //                 }
    //             };

    const header = () => {
        return (
            <>
                <h1>match travels</h1>
            </>
        )
    }
    const SendJoinReqForDriver = async(travelDriverId) => {
        
        const communicationObj = {
            travelPassengerId : originTravel.travelId,
            travelDriverId :travelDriverId,
        }

        try{
            const response = await post(`${URL}/communications`,JSON.stringify(communicationObj));
            console.log("response communications" ,response)
            socket.emit('passenger_join',{room : travelDriverId ,msg: response.data})
            
        }
        catch(err){
            console.log(`ERROR ${err}`);
        }
       //       
        return
    }
    const listTemplate = (travel) => {
        keyCounter++;
        return (
            <div className="matchTravel">
                {/* {console.log("travel " + JSON.stringify(travel))}
                 {console.log("geocodeAddress  "+geocodeAddress(travel.startPoint.x,travel.startPoint.y).then((result) => {console.log(result);}))} 
                 <h1> {console.log(geocodeAddress(travel.startPoint.x,travel.startPoint.y).then((result) => {return(<h1>{result}</h1>)}))} - {console.log(geocodeAddress(travel.destinationPoint.x,travel.destinationPoint.y).then((result) => {return(<h1>{result}</h1>)}))}</h1> */}

                <div>Tryout starts at: {travel.date}</div>
                <div>Amount of additional places: {travel.additionalSeats}</div>
                <button onClick={SendJoinReqForDriver(travel.id)}>Send join  request for driver</button>
            </div>
        );
    };
    
    return (
        <>
            <DataView key={keyCounter} value={matchTravels} itemTemplate={listTemplate} header={header()}/>
        </>
    );
}

export default ShowsMatchTravels;



//  import React, { useState, useEffect } from 'react';

//     const LocationComponent = () => {
//         const [address, setAddress] = useState('');
    
//         const geocodeAddress = async (latitude, longitude) => {
//             try {
//                 const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc`);
//                 const data = await response.json();
//                 if (data.results && data.results.length > 0) {
//                     setAddress(data.results[0].formatted_address);
//                 } else {
//                     setAddress('Address not found');
//                 }
//             } catch (error) {
//                 console.error(error);
//                 setAddress('Error retrieving address');
//             }
//         };
    
//         useEffect(() => {
//             geocodeAddress(31.808294, 35.222615);
//         }, []);
    
//         return (
//             <p>{address}</p>
//         );
//     };
    
//     export default LocationComponent;
