import React, {useEffect} from 'react';
import {authGoogle, login} from "../utils/FetchData";
import {clientId} from "../functions/secureData";
import {useNavigate} from "react-router";
import LoginMainLogo from "../components/LoginMainLogo";
import LoginForm from "../components/LoginForm";
import light from '../assets/sunny.png';
import dark from '../assets/moon.ico';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import ChangeThemeButton from "../components/ChangeThemeButton";
import {toast, ToastContainer} from "react-toastify"; // <-- import styles to be used

const Login = (props:{theme: string, setTheme: any}) => {
    const nav = useNavigate();
    const handleNav = (role: string|null, token: string|null) => {
        if (role === null || token === null)
            return;

        localStorage.setItem('access_token', token);
        if (role === "admin")
            nav("/admin-home")
        else if (role === "user")
            nav("/home")
    }
    async function handleCallbackResponse(response : google.accounts.id.CredentialResponse){
        const res = await authGoogle(response.credential);
        if(res instanceof Error){
            const notify = () => toast.error("Server is not responding");
            notify();
        }

        handleNav(res!.role, res!.token);
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCallbackResponse
        });
        const themeButton = props.theme === 'dark' ? 'filled_black' : 'outline';
        google.accounts.id.renderButton(
            document.getElementById("signInDiv")!,
            {theme: themeButton, size: "large", type: "standard", shape: "rectangular", text: 'signin_with', logo_alignment: 'center', width: '100px'}
        );
    },[])


    return (
        <div className='login-wrapper' data-theme={props.theme}>
            <ChangeThemeButton theme={props.theme} setTheme={props.setTheme}/>
            <div className='login-main-content-wrapper'>
                <LoginMainLogo theme={props.theme.toString()}/>
                <LoginForm theme={props.theme}/>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={props.theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default Login;