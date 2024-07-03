// import React, { useState, useContext } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link } from 'react-router-dom';
// import { UserContext } from '../App';
// //import { FaBeer } from "react-icons/fa";
// //import '../style/login.css'

// function Register() {
//     const { currentUser, setCurrentUser } = useContext(UserContext);
//     const { register, handleSubmit, errors } = useForm(useForm({
//         defaultValues: {
//             username: '',
//             email: '',
//             password: '',
//             verifyPassword: ''
//         }
//     }));


//     const onSubmit = (data) => {
//         SignUp(data);
//     };

//     async function SignUp(myUser) {
//         console.log(user)
//         try {
//             const userExistResponse = await fetch(`http://localhost:8080/passwords/${user.username}`, {
//                 method: 'GET',
//             });

//             const userExist = await userExistResponse.json();
//             // console.log("loginJson: " +JSON.stringify(loginJson.data));
//             if (userExist.data != '') {
//                 alert('User already exists, please log in!');
//                 return; // Exit the function if unauthorized
//             }

//             const registerResponse =await fetch(`http://localhost:8080/register`, {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     username: myUser.username,
//                     email: myUser.email,
//                     password: myUser.password
//                 }),
//                 headers: {
//                     'Content-type': 'application/json; charset=UTF-8'
//                 }
//             });

//         }
//         catch (error) {
//             console.error('Error during login:', error);
//             // Handle errors gracefully, e.g., display an error message to the user
//         }

//     }




//     return (
//         <>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div>
//                 <label>
//                     username:
//                     <input type="text" {...register('username', { required: true })} />
//                 </label>
//                 {/* {errors.name && <p>required</p>} */}
//                 </div>
//                 <div>
//                 <label>
//                     email:
//                     <input type="email" {...register('email', { required: true })} />
//                 </label>
//                 {/* {errors.name && <p>required</p>} */}
//                 </div>
//                 <div>
//                 <label>
//                     password:
//                     <input type="password" {...register('password', { required: true })} />
//                 </label>
//                 {/* {errors.password && <p></p>} */}
//                 </div>
//                 <div>
//                 <label>
//                     verify password:
//                     <input type="password" {...register('veryfyPassword', { required: true })} />
//                 </label>
//                 {/* {errors.password && <p></p>} */}
//                 </div>
//                 <button type="submit">sign up</button>
//             </form>
//             <Link to="/register">Not a member yet? Sign up</Link>
//         </>
//     );


//     // }
// }
// export default Register;



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




