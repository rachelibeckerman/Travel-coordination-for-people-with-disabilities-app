import React, { useState } from "react";
import { post } from "../GeneralRequest"
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import "./SearchTravelForm.css"
import ShowsMatchTravels from '../ShowsMatchTravels/ShowsMatchTravels'
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
const URL = 'http://localhost:8080';

const SearchTravelForm = ({ userId, userType, closeModal }) => {


  const [closetTravels, setClosetTravels] = useState(null)
  // const [showsMatchTravels, setShowsMatchTravels] = useState(false)
  console.log("closetTravels");
  console.log(closetTravels);
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
    }

    const travelObject = {
      userId,
      userType,
      ...formData,
      isAvailable: 1
    };

    // let location = {
    //   latStart: formData.latStart,
    //   lngStart: formData.lngStart,
    //   latDestination: formData.latDestination,
    //   lngDestination: formData.lngDestination
    // }

    // location = JSON.stringify(location)

    try {
      const response = await post(`${URL}/travels`, JSON.stringify(travelObject));
      console.log("response.data: ")
      console.log( response)
      // console.log( JSON.stringify(response.data))
      // setClosetTravels(response.data.closetTravels)

    } catch (err) {
      console.log("😢")
      console.error(`ERROR: ${err}`)
    }
    closeModal(formData)
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

      <Button id type="submit" label="Search relevant travel" onClick={handleSubmit} />


      {/* {showsMatchTravels==true&&<ShowsMatchTravels baseTravel={formData}/>} */}
      {error && <p>{error}</p>}
    </>
  );
};

export default SearchTravelForm;