import React, { useState, useEffect } from 'react';
import { json, useParams } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { get } from "../../components/GeneralRequest"
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Sidebar } from 'primereact/sidebar';
import ShowsMatchTravels from '../ShowsMatchTravels/ShowsMatchTravels.jsx';
import './ShowPassengerTravels.css'


const URL = 'http://localhost:8080';

function ShowPassengerTravels({ travels, geocodeAddress, socket }) {
    const [communications, setCommunications] = useState([]);
    const [singleTravels, setSingleTravels] = useState([]);
    const [editTravels, seteditTravelsView] = useState(null)
    const [showsMatchTravels, setShowsMatchTravels] = useState({ status: false, originTravel: null })
    const { id } = useParams();
    let keyCounter1 = 0;
    let keyCounter2 = 0;
    useEffect(() => {
        fetchData();
    }, [])


    async function fetchData() {
        let tempCommunications = [];
        let tempSingleTravels = [];

        try {

            for (let i = 0; i < travels.length; i++) {
                if (travels[i].userType == 'passenger') {
                    let fullURL = `${URL}/communications/?travelPassengerId=${travels[i].id}`;
                    const response = await get(fullURL);
                    const communicationsData = response.data
                    if (communicationsData.length != 0) {
                        tempCommunications = tempCommunications.concat(communicationsData);
                    }
                    else {
                        tempSingleTravels = tempSingleTravels.concat([travels[i]]);
                    }
                }
                
            }
            for (let i = 0; i < tempCommunications.length; i++) {
                const [passengerStart, passengerDestination] = await geocodeAddress(tempCommunications[i].passengerTravel.startPoint, tempCommunications[i].passengerTravel.destinationPoint);
                const [driverStart, driverDestination] = await geocodeAddress(tempCommunications[i].driverTravel.startPoint, tempCommunications[i].driverTravel.destinationPoint);
                tempCommunications[i].passengerTravel = { ...tempCommunications[i].passengerTravel, startLocationTxt: passengerStart, destinationLocationTxt: passengerDestination };
                tempCommunications[i].driverTravel = { ...tempCommunications[i].driverTravel, startLocationTxt: driverStart, destinationLocationTxt: driverDestination };
            }
            for (let i = 0; i < tempSingleTravels.length; i++) {
                const [Start, Destination] = await geocodeAddress(tempSingleTravels[i].startPoint, tempSingleTravels[i].destinationPoint);
                tempSingleTravels[i] = { ...tempSingleTravels[i], startLocationTxt: Start, destinationLocationTxt: Destination };
            }
            setCommunications(tempCommunications)
            setSingleTravels(tempSingleTravels)
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    }


    const listTemplateComm = (communication) => {
        keyCounter1++;

        return (
            <>
                {
                    <div style={{ display: 'flex', alignItems: "center" }}>
                        <div className={communication.status == 1 ? "waitingTravelDiv" : "confirmedTravelDiv"}>
                            <div className='travelItem'>
                                <h2>Passenger Info</h2>
                                <h3>from: {communication.passengerTravel.startLocationTxt}</h3>
                                <h3>to: {communication.passengerTravel.destinationLocationTxt}</h3>
                                <h3>at: {communication.passengerTravel.date.replace('T', ' ').substring(0, communication.passengerTravel.date.indexOf('.'))}</h3>
                            </div>

                            {communication.status == 2 && <span className="pi pi-link" style={{ fontSize: "40px" }}></span>}
                            {communication.status == 1 && <span className="pi pi-arrow-circle-right" style={{ fontSize: "40px" }}></span>}
                            <div className='travelItem'>
                                <h2>Driver Info</h2>
                                <h3>from: {communication.driverTravel.startLocationTxt}</h3>
                                <h3>to: {communication.driverTravel.destinationLocationTxt}</h3>
                                <h3>at: {communication.driverTravel.date.replace('T', ' ').substring(0, communication.driverTravel.date.indexOf('.'))}</h3>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    };

    const handleSearchTravel = (travel) => {
        let baseTravel = {
            userId: travel.userId,
            userType: travel.userType,
            date: travel.date,
            latStart: travel.startPoint.x,
            lngStart: travel.startPoint.y,
            latDestination: travel.destinationPoint.x,
            lngDestination: travel.destinationPoint.y,
            additionalSeats: travel.additionalSeats,
            isAvailable: travel.isAvailable,
            travelId: travel.id
        }
        setShowsMatchTravels({ status: true, originTravel: baseTravel })
    }

    const listTemplateSingles = (travel) => {
        keyCounter2++;
        const [autocomplete, setAutocomplete] = useState(null);
        const onLoad = (autocomplete) => {
            setAutocomplete(autocomplete);
        };

        const onPlaceChanged = () => {
            if (autocomplete !== null) {
                const place = autocomplete.getPlace();
                setSelectedPlace({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
            } else {
                console.log('Autocomplete is not loaded yet!');
            }
        };


        return (
            <>
                <div className='singleTravelDiv'>
                    {

                        editTravels == travel.id ?
                            <div className='travelItem'>
                                <div>
                                    <h3>from</h3>
                                    <LoadScript libraries={["places"]} googleMapsApiKey='AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc'>
                                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                            <InputText
                                                type="text"
                                                defaultValue={travel.startLocationTxt}
                                                placeholder="Enter a location"
                                                style={{ width: '300px' }}
                                            />
                                        </Autocomplete>
                                    </LoadScript>
                                </div>
                                <div>
                                    <h3>to</h3>
                                    <LoadScript libraries={["places"]} googleMapsApiKey='AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc'>
                                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                            <InputText
                                                type="text"
                                                defaultValue={travel.destinationLocationTxt}
                                                placeholder="Enter a location"
                                                style={{ width: '300px' }}
                                            />
                                        </Autocomplete>
                                    </LoadScript>
                                </div>
                                <InputText type="text" defaultValue={travel.additionalSeats} />
                                <Button label='update' className="p-button-rounded p-button-danger" onClick={() => (travel.id)} />
                                <Button label='cancel' className="p-button-rounded p-button-danger" onClick={() => seteditTravelsView(null)} />
                            </div>
                            :
                            <div className='travelItem'>
                                <h3>from: {travel.startLocationTxt}</h3>
                                <h3>to: {travel.destinationLocationTxt}</h3>
                                <h3>at: {travel.date.replace('T', ' ').substring(0, travel.date.indexOf('.'))}</h3>
                                <h3>Additional seats: {travel.additionalSeats}</h3>
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteTravelView(travel.id)} />
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => seteditTravelsView(travel.id)} />
                                <Button icon="pi pi-search" className="p-button-rounded p-button-search" onClick={() => handleSearchTravel(travel)} />
                            </div>
                    }
                </div>
            </>
        );
    };
    return (
        <>
            {communications.length != 0 && <DataView key={keyCounter1} value={communications} itemTemplate={listTemplateComm} />}
            {singleTravels.length != 0 && <DataView key={keyCounter2} value={singleTravels} itemTemplate={listTemplateSingles} />}
            <Sidebar style={{ width: '500px' }} visible={showsMatchTravels.status} onHide={() => setShowsMatchTravels({ status: false, originTravel: null })} className="w-full md:w-20rem lg:w-30rem">
                <ShowsMatchTravels originTravel={showsMatchTravels.originTravel} hideSidebar={() => setShowsMatchTravels({ status: false, originTravel: null })} socket={socket} />
            </Sidebar>
        </>
    );
}

export default ShowPassengerTravels;