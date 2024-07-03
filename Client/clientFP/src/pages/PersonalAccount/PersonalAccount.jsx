import React, { useState, useEffect } from 'react';
import { useContext } from "react"
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { get } from "../../components/GeneralRequest"
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Menubar } from 'primereact/menubar';
import ShowTravelsToConfirm from '../../components/ShowTravelsToConfirm/ShowTravelsToConfirm'
import 'primeicons/primeicons.css';
import "./PersonalAccount.css";
import io from 'socket.io-client';


const URL = 'http://localhost:8080';

function PersonalAccount() {
  const { id } = useParams();
  const [userTravels, setUserTravels] = useState([])
  const [editTravels, seteditTravels] = useState(null)
  const [updateTravelObj, setUpdateTravelObj] = useState({})
  const [times, setTimes] = useState(true)
  const [showTravels, setShowTravels] = useState(true);
  const [showWaiting, setShowWaiting] = useState(false);
  let keyCounter = 0;

  const items = [
    {
      label: 'Travels',
      icon: 'pi pi-home',
      command: () => {
        setShowTravels(true);
        setShowWaiting(false);
      }
    },
    {
      label: 'Waiting',
      icon: 'pi pi-star',
      command: () => {
        setShowTravels(false);
        setShowWaiting(true);
      }
    },
    {
      label: 'Projects',
      icon: 'pi pi-search',
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope'
    }
  ];

  useEffect(() => {
    async function f() {
      if (id) {
        try {
          const response = await get(`${URL}/travels/?userId=${id}`);
          console.log("all travels response " + JSON.stringify(response))
          for (let i = 0; i < response.data.length; i++) {
            const [start, destination] = await geocodeAddress(response.data[i].startPoint, response.data[i].destinationPoint);
            response.data[i] = { ...response.data[i], startLocationTxt: start, destinationLocationTxt: destination }
          }
          setUserTravels(response.data)
        }
        catch (err) {
          console.log(`ERROR: ${err}`)
        }
      }
    }; f();
  }, [])

  const geocodeAddress = async (startPoint, destinationPoint) => {
    try {
      console.log("in GeocodeAddress")
      const startPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${startPoint.x},${startPoint.y}&language=en&key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc`);
      const startPointData = await startPointResponse.json();
      const destinatioPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPoint.x},${destinationPoint.y}&language=en&key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc`);
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



  const deleteTravel = (travelId) => {
    alert(travelId)
  }

  const header = () => {
    return (
      <>
        <h1>your's travels</h1>
      </>
    )
  }




  const listTemplate = (travel) => {
    keyCounter++;
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


    return (
      <>
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
              <Button label='cancel' className="p-button-rounded p-button-danger" onClick={() => seteditTravels(null)} />
            </div>
            :
            <div className='travelItem'>
              <h3>from: {travel.startLocationTxt}</h3>
              <h3>to: {travel.destinationLocationTxt}</h3>
              <h3>Additional seats: {travel.additionalSeats}</h3>
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteTravel(travel.id)} />
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => seteditTravels(travel.id)} />
            </div>


        }

      </>
    );
  };

  return (
    <>
      <div className="card">
        <Menubar model={items} />
      </div>
      {showTravels && <DataView key={keyCounter} value={userTravels} itemTemplate={listTemplate} header={header()} />}
      {showWaiting && <ShowTravelsToConfirm travels={userTravels} geocodeAddress={geocodeAddress} />}
    </>
  );
}

export default PersonalAccount;