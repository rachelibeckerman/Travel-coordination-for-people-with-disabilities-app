
import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
import { useContext } from "react"
import { UserContext } from "../../App";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TravelFrom from '../../components/TravelForm/TravelForm';
import ShowsMatchTravels from '../../components/ShowsMatchTravels/ShowsMatchTravels'
import { Sidebar } from 'primereact/sidebar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './Home.css'

import { Toast } from 'primereact/toast';


const URL = 'http://localhost:8080';

function Home({ socket }) {

    const navigate = useNavigate()
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [originTravel, setOriginTravel] = useState(null);
    const [showsMatchTravels, setShowsMatchTravels] = useState(false);
    const [travelsToConfirm, setTravelsToConfirm] = useState([])
    const { id } = useParams();
    const [activeLink, setActiveLink] = useState('home');

    const handleNavClick = (componentName) => {
        setActiveLink(componentName);
    };

   
    const toast = useRef(null);

    const logOut = () => {
        localStorage.removeItem("currentUser");
        window.history.replaceState(null, null, '/');
        navigate('/');
    }

    const handleSearch = (params) => {
        setActiveLink("home")
        setOriginTravel(params);
        setShowsMatchTravels(true)
    }

    const handleAdd = (params) => {
        setActiveLink("home")
        console.log("join_room join_room", { room: params.travelId })
        socket.emit('join_room', { room: params.travelId });
        socket.on('passenger_joined', (data) => {
            setTravelsToConfirm([...travelsToConfirm, data]);
        })
    }


    return (
        <>
            <nav className="navbar">
                <p className={`nav-link ${activeLink == 'AddTravel' ? 'active-link' : ''}`} onClick={() => handleNavClick("AddTravel")} ><Link to={`/user/${id}`}>Add travel</Link></p>
                <p className={`nav-link ${activeLink == 'SearchTravel' ? 'active-link' : ''}`} onClick={() => handleNavClick("SearchTravel")} ><Link to={`/user/${id}`}>Search travel</Link></p>
                <p className={`nav-link ${activeLink == 'PersonaAccount' ? 'active-link' : ''}`} onClick={() => handleNavClick("PersonaAccount")} ><Link to="./personalAccount">Personal account</Link></p>
                <p className={`nav-link`} onClick={logOut} ><Link>Logout</Link></p>
            </nav>
            {activeLink == 'AddTravel' && <TravelFrom userId={id} userType="driver" closeModal={handleAdd} />}
            {activeLink == 'SearchTravel' && <TravelFrom userId={id} userType="passenger" closeModal={handleSearch} />}

            <Sidebar style={{ width: '500px' }} visible={showsMatchTravels} onHide={() => setShowsMatchTravels(false)} className="w-full md:w-20rem lg:w-30rem">
                <ShowsMatchTravels originTravel={originTravel} hideSidebar={() => setShowsMatchTravels(false)} socket={socket} />
            </Sidebar>

            <Outlet />
        </>
    );
}

export default Home;






