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

function ShowPassengerTravels({ travels, geocodeAddress }) {
    const [communications, setCommunications] = useState([]);
    const [singleTravels, setSingleTravels] = useState([]);
    const [editTravels, seteditTravelsView] = useState(null)
    const [showsMatchTravels, setShowsMatchTravels] = useState([false, null])
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
                    console.log("fullURL", fullURL);
                    const response = await get(fullURL);
                    const communicationsData = response.data
                    console.log("response1==  " + response)
                    if (communicationsData.length != 0) {
                        tempCommunications = tempCommunications.concat(communicationsData);

                    }
                    else {
                        tempSingleTravels = tempSingleTravels.concat([travels[i]]);
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

    const listTemplateComm = (communication) => {
        keyCounter1++;
        console.log("commuioncation after count", communication)

        return (
            <>
                {
                    <div style={{ display: 'flex', alignItems: "center" }}>
                        <div className={communication.status == 1 ? "waitingTravelDiv" : "confirmedTravelDiv"}>
                            <div className='travelItem'>
                                <h2>Passenger Info</h2>
                                <h3>from: {communication.passengerTravel.startLocationTxt}</h3>
                                <h3>to: {communication.passengerTravel.destinationLocationTxt}</h3>
                            </div>

                            {communication.status == 2 && <span className="pi pi-link" style={{ fontSize: "40px" }}></span>}
                            {communication.status == 1 && <span className="pi pi-arrow-circle-right" style={{ fontSize: "40px" }}></span>}
                            <div className='travelItem'>
                                <h2>Driver Info</h2>
                                <h3>from: {communication.driverTravel.startLocationTxt}</h3>
                                <h3>to: {communication.driverTravel.destinationLocationTxt}</h3>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    };

    const handleSearchTravel = (travel) => {
        // let baseTravel = {
        //     id: travel.id,
        //     userId: id,
        //     date: travel.date,
        //     startPoint: { x: travel.latStart, y: travel.lngStart},
        //     destinationPoint: { x: travel.latDestination, y: travel.lngDestination },
        //     additionalSeats: travel.additionalSeats,
        //     isAvailable: travel.isAvailable,
        //     userType: travel.userType,
        // }
        // let baseTravel={
        //     "userId":"1",
        //     "userType":"passenger",
        //     "date":"2024-07-10T14:57:57.707Z",
        //     "latStart":"31.780556",
        //     "lngStart":" 35.208762",
        //     "latDestination":"31.787821",
        //     "lngDestination":"35.202598",
        //     "additionalSeats":"2",
        //     "isAvailable":1,
        //     "travelId":203
        // }
        console.log("tttttrrrrrvvvvvlll  "+JSON.stringify(travel));
        // console.log("baseTravel😒👌😒 " +baseTravel)
        // setShowsMatchTravels[true,baseTravel]
    }

    const listTemplateSingles = (travel) => {
        keyCounter2++;
        const [autocomplete, setAutocomplete] = useState(null);
        // const [selectedPlace, setSelectedPlace] = useState(null);

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

        // const handleSearch = (originTravel) => {
        //     return (<>
        //         <Sidebar style={{ width: '500px' }} visible={true} onHide={() => setShowsMatchTravels(false)} className="w-full md:w-20rem lg:w-30rem">
        //             <ShowsMatchTravels originTravel={originTravel}  />
        //         </Sidebar>
        //     </>)
        // }

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
                                <h3>Additional seats: {travel.additionalSeats}</h3>
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteTravelView(travel.id)} />
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => seteditTravelsView(travel.id)} />
                                <Button icon="pi pi-search" className="p-button-rounded p-button-search" onClick={()=>handleSearchTravel(travel)} />
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
            <Sidebar style={{ width: '500px' }} visible={showsMatchTravels[0]} onHide={() => setShowsMatchTravels(false)} className="w-full md:w-20rem lg:w-30rem">
                <ShowsMatchTravels originTravel={showsMatchTravels.originTravel} />
            </Sidebar>
        </>
    );
}

export default ShowPassengerTravels;