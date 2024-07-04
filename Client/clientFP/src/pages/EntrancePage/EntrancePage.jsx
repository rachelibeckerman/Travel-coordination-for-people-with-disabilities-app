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
        return (<>hello</>);
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




      <div className="navbar" >
        <nav className="navbar">
          {/* <a style={{width:"20px", height:"20px"}}><  img src={logo1} /></a> */}
          
          <p  className={`nav-link ${activeLink == 'Login' ? 'active-link' : ''}`} onClick={() => handleNavClick("Login")} ><Link to="/login">Login</Link></p>
          <p  className={`nav-link ${activeLink == 'Register' ? 'active-link' : ''}`} onClick={() => handleNavClick("Register")} ><Link to="/register">Register</Link></p>
          <p  className={`nav-link ${activeLink == 'AboutUs' ? 'active-link' : ''}`} onClick={() => handleNavClick("AboutUs")} ><Link >About us</Link></p>
        </nav>
      </div>
      <div className="content">
        {renderSelectedComponent()}
      </div>
      <Outlet />
    </>
  );
};

export default EntrancePage