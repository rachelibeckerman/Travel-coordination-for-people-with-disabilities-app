import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { FaBeer } from "react-icons/fa";
import logo1 from '../IMG/logo1.jpg';


function EntrancePage() {

    // useEffect(() => {
    //     async function fetchData(){
    //         const token = localStorage.getItem('jwtToken');
    //         const verifyToken= await fetch('/api/users/123', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         const jsonVerifyToken= await verifyToken.json();
    //         console.log(jsonVerifyToken)
    //             // .then(response => response.json())
    //             // .then(user => console.log(user));
    //     }
    //     fetchData()
    // },[]);

    return (
        <>
            <img src={logo1} />

            <h1>Darchei Noam</h1>
            <h5>Travel arrangement for people with disabilities</h5>
            <button> <Link to={`./login`}>Join us now</Link></button>
            <a>more about us</a>
        </>
    );
}

export default EntrancePage;




