import React, {useEffect} from 'react';
import {authGoogle, login} from "../utils/FetchData";
import {clientId} from "../functions/secureData";
import {useNavigate} from "react-router";
import LoginMainLogo from "../components/LoginMainLogo";
import LoginForm from "../components/LoginForm";
import light from '../assets/sunny.png';
import dark from '../assets/moon.ico';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

const Login = (props:{theme: string, setTheme: any}) => {
    const nav = useNavigate();
    const handleNav = (role: string|null, token: string|null) => {
        if (role === null || token === null)
            return;

        if (role === "admin")
            nav("/admin-home")
        else if (role === "user")
            nav("/home")
    }
    async function handleCallbackResponse(response : google.accounts.id.CredentialResponse){
        const res = await authGoogle(response.credential);
        handleNav(res!.role, res!.token);
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv")!,
            {theme: "filled_black", size: "large", type: "standard", shape: "square", text: 'signin_with', logo_alignment: 'left', width: '500px'}
        );
    },[])



    const handleTheme = () => {
        props.setTheme(props.theme === 'light' ? 'dark' : 'light');
    }
    return (
        <div className='login-wrapper' data-theme={props.theme}>
            <div className="login-change-theme-wrapper">
                <button className="login-change-theme" onClick={handleTheme}>
                    <FontAwesomeIcon icon={props.theme === 'light' ? solid('moon') : solid('sun')} />
                </button>
            </div>
            <div className='login-main-content-wrapper'>
                <LoginMainLogo theme={props.theme.toString()}/>
                <LoginForm/>
            </div>
        </div>
    );
};

export default Login;