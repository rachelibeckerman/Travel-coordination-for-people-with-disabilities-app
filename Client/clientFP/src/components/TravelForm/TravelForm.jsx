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

  const [formData, setFormData] = useState({
    date: '',
    latStart: '',
    lngStart: '',
    latDestination: '',
    lngDestination: '',
    additionalSeats: null
  });

  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.date || !formData.latStart || !formData.lngStart || !formData.latDestination || !formData.lngDestination) {
      setError('Please fill in all required fields.');
      ;
    }

    const travelObject = {
      userId,
      userType,
      ...formData,
      isAvailable: 1
    };

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
      <InputText
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

      {error && <p>{error}</p>}
    </>
  );
};

export default TravelForm;


