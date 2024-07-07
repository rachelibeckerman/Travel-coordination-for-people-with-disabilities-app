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
  const [formData, setFormData] = useState({
    date: '',
    startLocation: '',
    destinationLocation: '',
    additionalSeats: null
  });

  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  
  const getGeoFromAddress = (place, type) => {
    if (type == 'startLocation') {
      setStartGeo({
        latStart: place.geometry.location.lat(),
        lngStart: place.geometry.location.lng()
      }
      )
    }
    else {
      setDesGeo({
        latDestination: place.geometry.location.lat(),
        lngDestination: place.geometry.location.lng()
      })
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.date || !formData.startLocation || !formData.destinationLocation) {
      setError('Please fill in all required fields.');
      ;
    }

    const travelObject = {
      userId,
      userType,
      date: formData.date,
      ...startGeo,
      ...desGeo,
      additionalSeats: formData.additionalSeats,
      isAvailable: 1
    };
    try {
      const response = await post(`${URL}/travels`, JSON.stringify(travelObject));
      userType == 'driver' ? closeModal({ travelId: response.data }) : closeModal({ ...travelObject, travelId: response.data });
    } catch (err) {
      console.error(`ERROR: ${err}`)
      closeModal('ERROR')
    }
  };


  return (
    <>
    {userType == 'driver' ?<h1>Add travel</h1>: <h1>Search</h1>}
      <form>
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
      </form>
      {error && <p>{error}</p>}
    </>
  );
};

export default TravelForm;


