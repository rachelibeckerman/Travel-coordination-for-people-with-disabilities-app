import React, { useState } from "react";
import { post } from "../GeneralRequest"
import "./TravelForm.css"
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import AutocompleteLocation from "../AutocompleteLocation/AutocompleteLocation";
import { LoadScript, Autocomplete } from '@react-google-maps/api';


const URL = 'http://localhost:8080';

const TravelForm = ({ userId, userType, closeModal }) => {
  const [startGeo, setStartGeo] = useState({})
  const [desGeo, setDesGeo] = useState({})
  //  const [geoLocations, setGeoLocations] = useState({})

  const [formData, setFormData] = useState({
    date: '',
    startLocation: '',
    destinationLocation: '',
    // latStart: '',
    // lngStart: '',
    // latDestination: '',
    // lngDestination: '',
    additionalSeats: null
  });

  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  let geoLocation = {
    latStart: '',
    lngStart: '',
    latDestination: '',
    lngDestination: '',
  }
  const getGeoFromAddress = (place, type) => {
    if (type == 'startLocation') {
      console.log("place.geometry.location.lat()+ " + place.geometry.location.lat())
      setStartGeo({
        latStart: place.geometry.location.lat(),
        lngStart: place.geometry.location.lng()
      }
      )
    }
    else {
      setDesGeo({
      latDestination : place.geometry.location.lat(),
      lngDestination : place.geometry.location.lng()
    })
    }
    // type == 'start' ?
    //   setStartGeo({
    //     lat: place.geometry.location.lat(),
    //     lng: place.geometry.location.lng()
    //   }) :
    //   setDesGeo({
    //     lat: place.geometry.location.lat(),
    //     lng: place.geometry.location.lng()
    //   })
    //   ;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.date || !formData.startLocation || !formData.destinationLocation) {
      setError('Please fill in all required fields.');
      ;
    }
    // console.log("geoLocation: " + JSON.stringify(geoLocation))

    const travelObject = {
      userId,
      userType,
      date: formData.date,
      // ...geoLocation,
      ...startGeo,
      ...desGeo,
      additionalSeats: formData.additionalSeats,
      isAvailable: 1
    };
    console.log("travelObject "+JSON.stringify(travelObject))
    try {
      const response = await post(`${URL}/travels`, JSON.stringify(travelObject));
      console.log("travelObject" + JSON.stringify({ ...travelObject, travelId: response.data }))
      userType == 'driver' ? closeModal({ travelId: response.data }) : closeModal({ ...travelObject, travelId: response.data });
    } catch (err) {
      console.error(`ERROR: ${err}`)
      closeModal('ERROR')
    }
  };


  return (
    <>
      <Calendar
        id="datetime24h"
        name="date"
        placeholder="Date"
        value={formData.date}
        onChange={handleInputChange}
        showTime hourFormat="24"
      />
      <br />

      <AutocompleteLocation
        placeholder="enter start location"
        value={formData.startLocation}
        name="startLocation"
        onChange={handleInputChange}
        getGeoCode={getGeoFromAddress}

      />
      <AutocompleteLocation
        placeholder="enter destination location"
        value={formData.destinationLocation}
        name="destinationLocation"
        onChange={handleInputChange}
        getGeoCode={getGeoFromAddress}
      />
      <>
        {/* <InputText
        type="text"
        placeholder="Start Location Latitude"
        name="latStart"
        value={formData.latStart}
        onChange={handleInputChange}
        required
      />
      <br />
      <InputText
        type="text"
        placeholder="Start Location Longitude"
        name="lngStart"
        value={formData.lngStart}
        onChange={handleInputChange}
        required
      />
      <br />
      <InputText
        type="text"
        placeholder="Destination Location Latitude"
        name="latDestination"
        value={formData.latDestination}
        onChange={handleInputChange}
        required
      />
      <br />
      <InputText
        type="text"
        placeholder="Destination Location Longitude"
        name="lngDestination"
        value={formData.lngDestination}
        onChange={handleInputChange}
        required 
      />*/}
      </>
      <br />
      <InputText
        type="number"
        placeholder="Additional Seats"
        name="additionalSeats"
        value={formData.additionalSeats}
        onChange={handleInputChange}
      />
      <br />
      <Button id type="submit" label={userType == 'driver' ? 'Add' : 'Search relevant travel'} onClick={handleSubmit} />

      {error && <p>{error}</p>}
    </>
  );
};

export default TravelForm;


{/* <>
import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const AutocompleteExample = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

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
        <LoadScript libraries={["places"]} googleMapsApiKey='AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc'>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Enter a location"
                    style={{ width: '300px' }}
                />
            </Autocomplete>
            {selectedPlace && (
                <div>
                    <p>Latitude: {selectedPlace.lat}</p>
                    <p>Longitude: {selectedPlace.lng}</p>
                </div>
            )}
        </LoadScript>
    );
};

export default AutocompleteExample;
</> */}