import {IUserLoginRequest} from "../interfaces/IUserLoginRequest";
import {getUsersLocale} from "../functions/getUsersLocale";
import {IRegisterUser} from "../interfaces/IRegisterUser";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import {IPostPutRequest} from "../interfaces/IPostPutRequest";
import {IUser} from "../interfaces/IUser";

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

export const deletePost = async (token: string|null, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post`, {
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
        console.log(response);
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}


export const getPostById = async (token: string, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/post/${postId}`, {
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


export const editPost = async (token: string|null, post: IPostPutRequest) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                postId: post.postId,
                description: post.description,
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const editUser = async (token: string|null, user: IUser) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/profile`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                id: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.userName,
                status: user.status,
                avatar: user.avatar,
                birthDate: user.birthDate,
                location: user.location,
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getMyFriends = async (token: string|null) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/friends`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getMyFollowers = async (token: string|null) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/followers`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getCommonFriends = async (token: string|null, profileId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/common-friends/${profileId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}
export const getUsersLikedPost = async (token: string|null, postId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Post/users-liked-post/${postId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}
export const AddReport = async (token: string|null, text: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Report/report`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                text: text,
                createdAt: new Date().toISOString(),
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const AddPostReport = async (token: string|null, postId:number, text: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Report/post-report`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                text: text,
                createdAt: new Date().toISOString(),
                postId: postId,
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const GetReports = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/reports`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const GetReport = async (token: string, reportId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/report/${reportId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const DeleteReport = async (token: string|null, reportId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/Report`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                reportId: reportId
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const GetPostReports = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/post-reports`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const GetPostReport = async (token: string, postReportId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/post-report/${postReportId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            }
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const DeletePostReport = async (token: string|null, postReportId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/Admin/post-report`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                reportId: postReportId
            })
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}

export const GetUserById = async (token: string|null, profileId: number) => {
    try {
        const response = await fetch(`${BASE_URL}api/User/profile/${profileId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept-Language': getUsersLocale(),
                'Authorization': 'Bearer ' + token,
            },
        });
        return response;
    }
    catch (error: any) {
        console.log(error);
        return error;
    }
}