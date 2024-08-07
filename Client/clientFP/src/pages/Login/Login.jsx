import React, { useState, useContext } from "react";
import { Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { post } from "../../components/GeneralRequest"
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App';
import { sha256 } from 'js-sha256';
import "./Login.css"
const URL = 'http://localhost:8080';

function Login() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [loginUser, setLoginUser] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginUser((prevProps) => ({
            ...prevProps,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loginRequest(loginUser)
    };

    const loginRequest = async (body) => {
        try {
            body.password = sha256(body.password);
            const response = await post(`${URL}/login`, JSON.stringify(body));
            if (response == undefined)
                alert("First time we meet? Sign up")
            else {
                const accessToken = response.data.accessToken;
                const cookies = new Cookies();
                cookies.set('accessToken', accessToken, { path: '/' });
                setCurrentUser(response.data.user);
                navigate(`/user/${response.data.user.id}`);
            }
        } catch (err) {
            console.error(`ERROR: ${err}`)
        }
    }


    return (<>

        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="username"
                name="username"
                value={loginUser.username}
                onChange={handleInputChange}
                required
            />
            <br />
            <input
                type="password"
                placeholder="password"
                name="password"
                value={loginUser.password}
                onChange={handleInputChange}
                required
            />
            <br />
            <button type="submit">Sign In</button>
        </form>
        <Link to="/register">Not a member yet? Sign up</Link>
    </>
    )
};

export default Login;



