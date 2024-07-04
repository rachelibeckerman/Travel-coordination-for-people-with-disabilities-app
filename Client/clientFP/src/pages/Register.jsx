import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { post } from "../components/GeneralRequest"
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App';

const URL = 'http://localhost:8080';

function SignUp() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [PasswordConfirm, setPasswordConfirm] = useState({
        passwordConfirm: "",
        passwordConfirmMassege: ""
    });
    const [SignUpUser, setSignUpUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSignUpUser((prevProps) => ({
            ...prevProps,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // if (SignUpUser.password != PasswordConfirm.passwordConfirm)
        //     setPasswordConfirm((prevProps) => ({
        //         ...prevProps,
        //         passwordConfirmMassege: "password didn't match"
        //     }));
        // else
        SignUpRequest(SignUpUser)
    };

    const SignUpRequest = async (body) => {
        try {
            const response = await post(`${URL}/register`, JSON.stringify(body));
            delete SignUpUser.password;
            setCurrentUser(SignUpUser);
            // localStorage.setItem("currentUser", JSON.stringify({ username: response.user.username, id: data.user.id }))
            navigate(`/user/${response.id}`);
        } catch (err) {
            console.log(`ERROR: ${err}`)
        }
    }

    return (<>

        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="UserName"
                name="username"
                value={SignUpUser.username}
                onChange={handleInputChange}
                required
            />
            <br />
            <input
                type="text"
                placeholder="first name"
                name="firstName"
                value={SignUpUser.firstName}
                onChange={handleInputChange}
                required
            />
            <br />
            <input
                type="text"
                placeholder="last name"
                name="lastName"
                value={SignUpUser.lastName}
                onChange={handleInputChange}
                required
            />
            <br />

            <input
                type="email"
                placeholder="Email"
                name="email"
                value={SignUpUser.email}
                onChange={handleInputChange}
                required
            />
            <br />
            <input
                type="text"
                placeholder="phone"
                name="phone"
                value={SignUpUser.phone}
                onChange={handleInputChange}
                required
            />
            <br />
            <input
                type="password"
                placeholder="password"
                name="password"
                value={SignUpUser.password}
                onChange={handleInputChange}
                required
            />
            <br />
            {/* <input
                type="password"
                placeholder="confirm password"
                name="passwordConfirm"
                value={PasswordConfirm.passwordConfirm}
                onChange={handleInputChange}
                required
            /> */}
            <div style={{ color: "red" }}>{PasswordConfirm.passwordConfirmMassege}</div>
            <button type="submit">Sign Up</button>
        </form>
        <Link to="/login">Log in</Link>
    </>
    )
};

export default SignUp;




