import React from 'react';
import {Link} from "react-router-dom";
import {login} from "../utils/FetchData";
import {useNavigate} from "react-router";

const LoginForm = () => {
    const nav = useNavigate();
    const loginUser = async () => {
        const res = await login({email: "user@example.com", password: "stringst"});
        handleNav(res!.role, res!.token);
    }
    const handleNav = (role: string|null, token: string|null) => {
        if (role === null || token === null)
            return;

        if (role === "admin")
            nav("/admin-home")
        else if (role === "user")
            nav("/home")
    }
    return (
        <div className="login-form-wrapper">
            <div className="login-form-text">
                Login to Pure Connect
            </div>

            <div>
                <input className='login-form-input' placeholder='Login' type="text"/>
                <input className='login-form-input' placeholder='Password' type="text"/>
            </div>

            <div className='login-form-additional-func'>
                <Link className='login-form-links' to={'soon'}>
                    Forgot password
                </Link>
                <Link className='login-form-links' to={'soon'}>
                    Already have an account
                </Link>
            </div>

            <div className='login-form-buttons-wrapper'>
                <div className='login-form-button-div'>
                    <button className='login-form-button' onClick={loginUser}>
                        Log In
                    </button>
                </div>

                <div id="signInDiv">

                </div>
            </div>
        </div>
    );
};

export default LoginForm;