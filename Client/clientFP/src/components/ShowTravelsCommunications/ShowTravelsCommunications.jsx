import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { get, put } from "../../components/GeneralRequest"
const URL = 'http://localhost:8080';

function ShowTravelsCommunications({ travels, geocodeAddress }) {
    const [communications, setCommunications] = useState([]);
    const { id } = useParams();
    let keyCounter = 0;
    console.log("communications===  "+communications);
    useEffect(() => {
        fetchData();
    }, [])


    async function fetchData() {
        let temp = [];
        try {
            for (let i = 0; i < travels.length; i++) {
                let fullURL1 = `${URL}/communications/?travelDriverId=${travels[i].id}&status=2`;
                let fullURL2 = `${URL}/communications/?travelPassengerId=${travels[i].id}&status=2`;
                console.log("fullURL", fullURL1+"   "+fullURL2);
                const response1 = await get(fullURL1);
                const response2 = await get(fullURL2);
                console.log("response1==  "+response1.data+" response2==  "+response2.data)
                let responseArr=[...response1.data,...response2.data]
                console.log("responseArr== "+responseArr.length)
                for (let i = 0; i < responseArr.length; i++) {
                    const [passengerStart, passengerDestination] = await geocodeAddress(responseArr[i].passengerTravel.startPoint, responseArr[i].passengerTravel.destinationPoint);
                    const [driverStart, driverDestination] = await geocodeAddress(responseArr[i].driverTravel.startPoint, responseArr[i].driverTravel.destinationPoint);
                    responseArr[i].passengerTravel = { ...responseArr[i].passengerTravel, startLocationTxt: passengerStart, destinationLocationTxt: passengerDestination };
                    responseArr[i].driverTravel = { ...responseArr[i].driverTravel, startLocationTxt: driverStart, destinationLocationTxt: driverDestination };
                }
                temp = temp.concat(responseArr);
                setCommunications(temp)
            }
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    }
    // const handleConfirm = async (communication) => {
    //     try {
    //         const response = await put(`${URL}/communications/${communication.id}`, JSON.stringify({ status: 2 }));
    //         console.log("commuincation", communication)
    //         console.log("congirim travel", { room: communication.driverTravel.id, confirmTo: communication.passengerTravel.id })
    //         socket.emit('confirm_travel', { room: communication.driverTravel.id, confirmTo: communication.passengerTravel.id })
    //         fetchData();
    //         console.log(response);
    //     } catch (err) {
    //         console.log(`ERROR: ${err}`);
    //     }

    // }

    const listTemplate = (communication) => {
        keyCounter++;
        console.log("commuioncation after count", communication)

        return (
            <>
                {
                    <div style={{ display: 'flex', alignItems: "center" }}>
                        <div className='travelItem'>
                            <h2>Passenger Info</h2>
                            <h3>passengerTravel {communication.passengerTravel.id}</h3>
                            <h3>driverTravel {communication.driverTravel.id}</h3>
                            <h3>from: {communication.passengerTravel.startLocationTxt}</h3>
                            <h3>to: {communication.passengerTravel.destinationLocationTxt}</h3>
                            <Button icon="pi pi-check-square" className="p-button-rounded p-button-info" onClick={() => { handleConfirm(communication) }} />
                        </div>
                        <span className="pi pi-arrow-circle-right" style={{ fontSize: "40px" }}></span>
                        <div className='travelItem'>
                            <h2>Driver Info</h2>
                            <h3>from: {communication.driverTravel.startLocationTxt}</h3>
                            <h3>to: {communication.driverTravel.destinationLocationTxt}</h3>
                        </div>
                    </div>
                }
            </>
        );
    };


    return (
        <>
            <DataView key={keyCounter} value={communications} itemTemplate={listTemplate} header={<h1>communications</h1>} />
            {/* {communications.map(c =>
                <div key={c.id}>
                    <p>{JSON.stringify(c)}</p>
                </div>
            )} */}
        </>
    );
}

export default ShowTravelsCommunications;