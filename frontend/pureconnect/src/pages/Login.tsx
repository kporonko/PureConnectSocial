import React, {useEffect} from 'react';
import {authGoogle, login} from "../utils/FetchData";
import {clientId} from "../functions/secureData";
import {ILoginResponseOk} from "../interfaces/ILoginResponseOk";
import {useNavigate} from "react-router";


const Login = () => {
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
            {theme: "filled_blue", size: "large", type: "icon", shape: "square", text: 'signin_with', logo_alignment: 'left', width: '500px'}
        );
    },[])

    const loginUserTest = async () => {
        const res = await login({email: "user@example.com", password: "stringst"});
        handleNav(res!.role, res!.token);
    }

    return (
        <div>
            <div id="signInDiv"></div>
            <button onClick={loginUserTest}>Aboba</button>
        </div>
    );
};

export default Login;