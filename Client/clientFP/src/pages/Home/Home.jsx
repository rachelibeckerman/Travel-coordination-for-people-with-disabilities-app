
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
    // const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleSearch, setVisibleSearch] = useState(false);
    const [activeLink, setActiveLink] = useState('home');

    const handleNavClick = (componentName) => {
        setActiveLink(componentName);
    };

    // const renderSelectedComponent = () => {
    //     switch (activeLink) {
    //         case 'home':
    //             return (
    //                 <div className='homeDiv'>
    //                     <h1 className='enterTitle'>hello {currentUser.username}</h1>
    //                 </div>
    //             )
    //         case 'AddTravel':
    //             return;
    //         case 'SearchTravel':
    //             return;
    //         case 'PersonaAccount':
    //             return (<>aboutUs</>);

    //     }
    // };
    const toast = useRef(null);

    const logOut = () => {
        localStorage.removeItem("currentUser");
        window.history.replaceState(null, null, '/');
        navigate('/');
    }

    const showConfirmToast = (data) => {
        console.log("in show function in home", data)
        toast.current.show({ severity: 'info', summary: 'Info', detail: data });

    }

    // useEffect(() => {
    //     const userLs = JSON.parse(localStorage.getItem("currentUser"));
    //     if (id == userLs.id) {
    //         response = get('')
    //         fetch(`${URL}/users/${id}`)
    //             .then((res) => res.json())
    //             .then((data) => { setUser(data); console.log(data) });
    //     }
    //     else{
    //         navigate('/404')
    //     }
    // }, []);


    const handleSearch = (params) => {
        console.log("params---------- " + JSON.stringify(params))
        setActiveLink("home")
        setOriginTravel(params);
        setShowsMatchTravels(true)
    }
    const handleAdd = (params) => {
        // setVisibleAdd(false);
        setActiveLink("home")
        console.log("join_room join_room", { room: params.travelId })
        socket.emit('join_room', { room: params.travelId });
        socket.on('passenger_joined', (data) => {
            console.log("passenger_joined ", data)
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

            {/* {activeLink == 'PersonaAccount' && <TravelFrom userId={id} userType="passenger" closeModal={handleSearch} />} */}

            {/* <button onClick={logOut}>Logout</button>
            <h1>Home</h1>
            {currentUser && console.log(currentUser)}
            {currentUser && <h2> Hi {currentUser.firstName}</h2>}

            <Button label="Add Travel" onClick={() => setVisibleAdd(true)} />
            <Dialog header="Add travel" visible={visibleAdd} onHide={() => { if (!visibleAdd) return; setVisibleAdd(false); }} >
                <div className="m-0">
                    <TravelFrom userId={id} userType="driver" closeModal={handleAdd} />
                </div>
            </Dialog>

            <Button label="Search Travel" onClick={() => setVisibleSearch(true)} />
            <Dialog header="Search Travel" visible={visibleSearch} onHide={() => { if (!visibleSearch) return; setVisibleSearch(false); }} >
                <div className="m-0">
                    <TravelFrom userId={id} userType="passenger" closeModal={handleSearch} />
                </div>
            </Dialog>

            <button onClick={() => navigate(`./personalAccount`)}>Personal Account</button>

            <Sidebar style={{ width: '500px' }} visible={showsMatchTravels} onHide={() => setShowsMatchTravels(false)} className="w-full md:w-20rem lg:w-30rem">
                <ShowsMatchTravels originTravel={originTravel} socket={socket} />
            </Sidebar> */}
            <Outlet />
        </>
    );
}

export default Home;






