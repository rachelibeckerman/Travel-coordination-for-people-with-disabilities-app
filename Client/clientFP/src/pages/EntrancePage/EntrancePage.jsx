// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import logo1 from '../IMG/logo1.jpg';


// function EntrancePage() {

//     // useEffect(() => {
//     //     async function fetchData(){
//     //         const token = localStorage.getItem('jwtToken');
//     //         const verifyToken= await fetch('/api/users/123', {
//     //             headers: {
//     //                 Authorization: `Bearer ${token}`,
//     //             },
//     //         })
//     //         const jsonVerifyToken= await verifyToken.json();
//     //         console.log(jsonVerifyToken)
//     //             // .then(response => response.json())
//     //             // .then(user => console.log(user));
//     //     }
//     //     fetchData()
//     // },[]);

//     return (
//         <>
//             <img src={logo1} />

//             <h1>Darchei Noam</h1>
//             <h5>Travel arrangement for people with disabilities</h5>
//             <button> <Link to={`./login`}>Join us now</Link></button>
//             <a>more about us</a>
//         </>
//     );
// }

// export default EntrancePage;




import React, { useState } from 'react';
import { Nav } from 'rsuite';
import './EntrancePage.css'
import logo1 from "../../IMG/logo1.jpg";
import homeImg from "../../IMG/4.jpg";
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
const EntrancePage = () => {
  // const [selectedComponent, setSelectedComponent] = useState('hello');
  const [activeLink, setActiveLink] = useState('hello');
  const handleNavClick = (componentName) => {
    setActiveLink(componentName);
  };
  const navigate = useNavigate();
  const renderSelectedComponent = () => {
    switch (activeLink) {
      case 'hello':
        return (
          <div className='homeDiv'>

            <h1 className='enterTitle'>Darchei Noam</h1>
            <h4 className='slogen'>Travel arrangement for people with disabilities</h4>

          </div>
        )
      // case 'Login':
      //   // navigate(`/login`);
      //   return;
      // case 'Register':
      //   // navigate(`/register`);
      //   return;
      // case 'AboutUs':
      //   return (<>aboutUs</>);

    }
  };

  return (
    <>





      <nav className="navbar">
        {/* <a style={{width:"20px", height:"20px"}}><  img src={logo1} /></a> */}

        <p className={`nav-link ${activeLink == 'Login' ? 'active-link' : ''}`} onClick={() => handleNavClick("Login")} ><Link to="/login">Login</Link></p>
        <p className={`nav-link ${activeLink == 'Register' ? 'active-link' : ''}`} onClick={() => handleNavClick("Register")} ><Link to="/register">Register</Link></p>
        <p className={`nav-link ${activeLink == 'AboutUs' ? 'active-link' : ''}`} onClick={() => handleNavClick("AboutUs")} ><Link >About us</Link></p>
      </nav>

      <div className="content">
        {renderSelectedComponent()}
      </div>
      <Outlet />
    </>
  );
};

export default EntrancePage







//  import React, { useState, useEffect } from 'react';

//     const LocationComponent = () => {
//         const [address, setAddress] = useState('');
    
//         const geocodeAddress = async (latitude, longitude) => {
//             try {
//                 const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc`);
//                 const data = await response.json();
//                 if (data.results && data.results.length > 0) {
//                     setAddress(data.results[0].formatted_address);
//                 } else {
//                     setAddress('Address not found');
//                 }
//             } catch (error) {
//                 console.error(error);
//                 setAddress('Error retrieving address');
//             }
//         };
    
//         useEffect(() => {
//             geocodeAddress(31.808294, 35.222615);
//         }, []);
    
//         return (
//             <p>{address}</p>
//         );
//     };
    
//     export default LocationComponent;
