import {IUserLoginRequest} from "../interfaces/IUserLoginRequest";
import {ILoginResponseOk} from "../interfaces/ILoginResponseOk";
import {ILoginResponseBad} from "../interfaces/ILoginResponseBad";
import {getUsersLocale} from "../functions/getUsersLocale";
import LocalizedStrings from "react-localization";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BASE_URL = "https://localhost:7219/";

export const login = async (loginData: IUserLoginRequest) => {
    const response = await fetch(`${BASE_URL}api/Login/login`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept-Language': getUsersLocale()
        },
        body: JSON.stringify({
            email: loginData.email,
            password: loginData.password
        })
    });

    const responseJson = await response.json()
    return responseJson;
}
export const authGoogle = async (token: string) => {
    const response = await fetch(`${BASE_URL}api/GoogleAuth/auth`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept-Language': getUsersLocale()
        },
        body: JSON.stringify({
            token: token
        })
    });

    const responseJson = await response.json()
    return responseJson;
}
