import React, {useEffect} from 'react';
import NavMenu from "../components/NavMenu";
import {getAvatar, getMyPosts} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import MainContentHome from "../components/MainContentHome";
import MainContentMyProfile from "../components/MainContentMyProfile";
import Post from "../components/Post";
import {IPost} from "../interfaces/IPost";
import MyPostsList from "../components/MyPostsList";

const MyProfile = (props: {theme: string, setTheme: any}) => {

    const [avatarImage, setAvatarImage] = React.useState("");

    const nav = useNavigate();
    let strings = new LocalizedStrings({
        en:{
            expired:"Your session is expired. Please log in again.",
        },
        ua: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    });



    useEffect( () => {
        const getUserData = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responseAvatar = await getAvatar(token);
                if (responseAvatar.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                const bodyAvatar = await responseAvatar.json();
                setAvatarImage(bodyAvatar.avatar);
            }
        };
        getUserData();
    }, []);

    return (
        <div className={'profile-wrapper'} data-theme={props.theme}>
            <NavMenu page={3} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
            <MainContentMyProfile theme={props.theme}/>

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

export default MyProfile;