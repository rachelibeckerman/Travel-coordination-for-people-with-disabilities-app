import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { get, put } from "../../components/GeneralRequest"
const URL = 'http://localhost:8080';

function ShowTravelsToConfirm({ travels, geocodeAddress }) {
    const [communications, setCommunications] = useState([]);
    const { id } = useParams();
    let keyCounter = 0;
    console.log(communications);
    useEffect(() => {
        fetchData();
    }, [])
    
    
    async function fetchData() {
        let temp = [];
        try {
            for (let i = 0; i < travels.length; i++) {
                let fullURL = `${URL}/communications/?travelDriverId=${travels[i].id}&status=1`;
                console.log("fullURL", fullURL);
                const response = await get(fullURL);
                for (let i = 0; i < response.data.length; i++) {
                    const [passengerStart, passengerDestination] = await geocodeAddress(response.data[i].passengerTravel.startPoint, response.data[i].passengerTravel.destinationPoint);

                    const [driverStart, driverDestination] = await geocodeAddress(response.data[i].driverTravel.startPoint, response.data[i].driverTravel.destinationPoint);
                    response.data[i].passengerTravel = { ...response.data[i].passengerTravel, startLocationTxt: passengerStart, destinationLocationTxt: passengerDestination };
                    response.data[i].driverTravel = { ...response.data[i].passengerTravel, startLocationTxt: driverStart, destinationLocationTxt: driverDestination };
                }
                temp = temp.concat(response.data);
                setCommunications(temp)
            }
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    }
    const handleConfirm = async (communication) => {
        try {
            const response = await put(`${URL}/communications/${communication.id}`, JSON.stringify({ status: 2 }));
            fetchData();
            console.log(response);
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }

    }

    const listTemplate = (communication) => {
        keyCounter++;


        return (
            <>
                {
                    <div style={{ display: 'flex', alignItems: "center" }}>
                        <div className='travelItem'>
                            <h2>Passenger Info</h2>
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
            <DataView key={keyCounter} value={communications} itemTemplate={listTemplate} header={<h1>Waiting to confirm</h1>} />
            {/* {communications.map(c =>
                <div key={c.id}>
                    <p>{JSON.stringify(c)}</p>
                </div>
            )} */}
        </>
    );
}

export default ShowTravelsToConfirm;