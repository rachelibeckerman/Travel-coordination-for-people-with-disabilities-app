import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from "react-router-dom";
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
import ShowPassengerTravels from '../../components/ShowPassengerTravels/ShowPassengerTravels';
import ShowDriverTravels from '../../components/showDriverTravels/showDriverTravels'
import 'primeicons/primeicons.css';
import "./PersonalAccount.css";
import { Toast } from 'primereact/toast';

const URL = 'http://localhost:8080';

function PersonalAccount({ socket }) {
  const { id } = useParams();
  const [userTravels, setUserTravels] = useState([])
  const [show, setShow] = useState(false)
  

  const toast = useRef(null);
  const [activeLink, setActiveLink] = useState('home');

  const handleNavClick = (componentName) => {
    setActiveLink(componentName);
  };

  useEffect(() => {
    async function f() {
      if (id) {
        try {
          const response = await get(`${URL}/travels/?userId=${id}`);
          for (let i = 0; i < response.data.length; i++) {
          }
          setUserTravels(response.data);
          travelsWaitingToconfirm(response.data);
        }
        catch (err) {
          console.log(`ERROR: ${err}`)
        }
      }
    }; f();
  }, [])

  const geocodeAddress = async (startPoint, destinationPoint) => {
    try {
      const startPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${startPoint.x},${startPoint.y}&language=en&key=API_KEY`);
      const startPointData = await startPointResponse.json();
      const destinatioPointResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPoint.x},${destinationPoint.y}&language=en&key=API_KEY`);
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

  const travelsWaitingToconfirm = (userTravels) => {
    for (let i = 0; i < userTravels.length; i++) {
      if (userTravels[i].userType == 'passenger' && userTravels[i].isAvailable == 1) {
        socket.emit('join_room', { room: userTravels[i].id })
      }
    }
  }


  socket.on("travel_confirmed", (data) => {
    console.log("travel_confirmed", typeof (data));
    // toast.current.show({ severity: 'info', summary: 'Info', detail: `travel ${data} confirm` });
    setShow(true)

  })

  useEffect(() => {
    show && toast.current.show({ severity: 'info', summary: 'Sticky', detail: `travel id  confirm` });
  }, [show])


  return (
    <>
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
      </div>
      <nav className="navbar-personal-account navbar">
        <p className={`nav-link ${activeLink == 'passenger' ? 'active-link' : ''}`} onClick={() => handleNavClick("passenger")} ><Link >Your passenger travels</Link></p>
        <p className={`nav-link ${activeLink == 'driver' ? 'active-link' : ''}`} onClick={() => handleNavClick("driver")} ><Link >Your driver travels</Link></p>
        <p className={`nav-link ${activeLink == 'waiting' ? 'active-link' : ''}`} onClick={() => handleNavClick("waiting")} ><Link >travels waiting to confirm</Link></p>
      </nav>
      {activeLink == 'passenger' && <ShowPassengerTravels travels={userTravels} geocodeAddress={geocodeAddress} socket={socket} />}
      {activeLink == 'driver' && <ShowDriverTravels travels={userTravels} geocodeAddress={geocodeAddress} socket={socket} />}
      {activeLink == 'waiting' && <ShowTravelsToConfirm travels={userTravels} geocodeAddress={geocodeAddress} socket={socket} />}
    </>
  );
}

export default PersonalAccount;
