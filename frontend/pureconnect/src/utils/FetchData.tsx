import {IUserLoginRequest} from "../interfaces/IUserLoginRequest";
import {getUsersLocale} from "../functions/getUsersLocale";
import {IRegisterUser} from "../interfaces/IRegisterUser";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

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

export const getRecommendedUsers = async (token: string) => {
    const response = await fetch(`${BASE_URL}api/User/recommended-users`, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const responseJson = await response.json()
    return responseJson;
}

export const getRecommendedPosts = async (token: string) => {
    const response = await fetch(`${BASE_URL}api/Post/recommended-posts`, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const responseJson = await response.json()
    return responseJson;
}

export const followUser = async (token: string|null, userId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Follows/follow`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                followeeId: userId,
                RequestDate: new Date().toISOString()
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const unfollowUser = async (token: string|null, userId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Follows/follow`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                followeeId: userId,
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const likePost = async (token: string|null, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/like`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                postId: postId,
                createdAt: new Date().toISOString()
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const unLikePost = async (token: string|null, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/like`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                postId: postId
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}


export const unfollowUserByPost = async (token: string|null, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Follows/follow-by-post`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                postId: postId
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getMyProfile = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/my-profile`, {
            method: 'GET',
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const responseJson = await response.json()
        return responseJson;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getMyPosts = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/posts`, {
            method: 'GET',
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getMyPostsImages = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/images`, {
            method: 'GET',
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}


export const addPost = async (token: string|null, post: IPostAddRequest) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                image: post.image,
                description: post.description,
                createdAt: new Date().toISOString()
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}