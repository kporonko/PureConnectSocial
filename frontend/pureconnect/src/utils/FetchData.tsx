import {IUserLoginRequest} from "../interfaces/IUserLoginRequest";
import {getUsersLocale} from "../functions/getUsersLocale";
import {IRegisterUser} from "../interfaces/IRegisterUser";

const BASE_URL = "https://localhost:7219/";

export const login = async (loginData: IUserLoginRequest) => {
    try {
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
    catch (error) {
        console.log(error);
        return error;
    }

}
export const authGoogle = async (token: string) => {
    try {
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
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const register = async (registerData: IRegisterUser) => {
    try {
        const response = await fetch(`${BASE_URL}api/Register`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale()
            },
            body: JSON.stringify({
                email: registerData.email,
                password: registerData.password,
                firstName: registerData.firstName,
                lastName: registerData.lastName,
                location: registerData.location,
                birthDate: registerData.birthDate,
                avatar: registerData.avatar,
                username: registerData.username
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getAvatar = async (token: string) => {
    const response = await fetch(`${BASE_URL}api/User/my-avatar`, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response;
}