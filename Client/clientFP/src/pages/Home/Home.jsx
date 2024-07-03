
import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
import { useContext } from "react"
import { UserContext } from "../../App";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TravelFrom from '../../components/TravelForm/TravelForm';
import SearchTravelForm from '../../components/SearchTravelForm/SearchTravelForm'
import ShowsMatchTravels from '../../components/ShowsMatchTravels/ShowsMatchTravels'
import { Sidebar } from 'primereact/sidebar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './Home.css'
import LocationForm from "../../components/AutocompleteLocation/AutocompleteLocation";

const URL = 'http://localhost:8080';

function Home({socket}) {

    const navigate = useNavigate()
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [originTravel, setOriginTravel] = useState(null);
    const [showsMatchTravels, setShowsMatchTravels] = useState(false);
    const [travelsToConfirm, setTravelsToConfirm] = useState([])
    const { id } = useParams();
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleSearch, setVisibleSearch] = useState(false);

    const logOut = () => {
        localStorage.removeItem("currentUser");
        window.history.replaceState(null, null, '/');
        navigate('/');
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
        setVisibleSearch(false);
        setOriginTravel(params);
        setShowsMatchTravels(true)
    }
    const handleAdd = (params) => {
        setVisibleAdd(false);
        console.log("join_room join_room" ,{ room: params.travelId })
        socket.emit('join_room', { room: params.travelId });
        socket.on('passenger_joined', (data) => {
            console.log("passenger_joined " ,data)

            setTravelsToConfirm([...travelsToConfirm, data]);
        })
    }
    return (
        <>
            <button onClick={logOut}>Logout</button>
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
                <ShowsMatchTravels originTravel={originTravel}  socket ={socket}/>
            </Sidebar>

        </>
    );
}

export default Home;






