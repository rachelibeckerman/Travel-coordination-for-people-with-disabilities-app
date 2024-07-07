import { useState, createContext } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import EntrancePage from "./pages/EntrancePage";
import EntrancePage from './pages/EntrancePage/EntrancePage';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import Home from './pages/Home/Home';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import PersonalAccount from './pages/PersonalAccount/PersonalAccount';
import NotFoundPage from './pages/NotFoundPage';
import './App.css'
import ShowsMatchTravels from './components/ShowsMatchTravels/ShowsMatchTravels';
import io from 'socket.io-client'; // Add this

export const UserContext = createContext();
const socket = io.connect('http://localhost:3000');

function App() {

  const [currentUser, setCurrentUser] = useState(
    /*{
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  }
  */
  )


  return (




    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<EntrancePage />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/user/:id" element={<Home socket={socket} />} >
            <Route path='personalAccount' element={<PersonalAccount socket={socket} />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
    </UserContext.Provider>

  )
}

export default App







