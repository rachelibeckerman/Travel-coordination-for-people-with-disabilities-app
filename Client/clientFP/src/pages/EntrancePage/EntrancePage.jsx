import React, { useState, useEffect } from 'react';
import { Nav } from 'rsuite';
import './EntrancePage.css'
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
const EntrancePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [])

  const [activeLink, setActiveLink] = useState('hello');
  const handleNavClick = (componentName) => {
    setActiveLink(componentName);
  };

  return (
    <>
      <nav className="navbar">
        <p className={`nav-link ${activeLink == 'Login' ? 'active-link' : ''}`} onClick={() => handleNavClick("Login")} ><Link to="/login">Login</Link></p>
        <p className={`nav-link ${activeLink == 'Register' ? 'active-link' : ''}`} onClick={() => handleNavClick("Register")} ><Link to="/register">Register</Link></p>
        <p className={`nav-link ${activeLink == 'AboutUs' ? 'active-link' : ''}`} onClick={() => handleNavClick("AboutUs")} ><Link to="/" >About us</Link></p>
      </nav>
      {activeLink == 'hello' &&
        <div className='homeDiv'>
          <h1 className='enterTitle'>Freedom wheels</h1>
          <h2 className='slogen'>Drive everyone everywhere</h2>
        </div>}
      {activeLink == 'AboutUs' &&
        <div>
          <h1>About us</h1>
          <p className='AboutUs'>Our organization was opened in 2020 and continues to this day<br />
            The organization was established as a result of awareness of the difficulty of disabled people to move from place to place,
            <br />
            which is both complicated and expensive. As a result, we began to establish a system to mediate travel between disabled people
            <br />
            and people who own a vehicle suitable for these people, usually people who own such vehicles are people who are dealing with this
            <br />
            problem in the immediate vicinity and are interested donate themselves and offer free rides to disabled people
            <br />
            If you are interested in donating yourself or if you are disabled and looking for a ride, you are welcome to join us</p>
        </div>
      }
      <div className="content">
      </div>
      <Outlet />
    </>
  );
};

export default EntrancePage


