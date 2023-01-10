import React, {useEffect} from 'react';
import NavMenu from "../components/NavMenu";
import {getAvatar} from "../utils/FetchData";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import MainContentHome from "../components/MainContentHome";
import MainContentMyProfile from "../components/MainContentMyProfile";

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
        const avatar = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const response = await getAvatar(token);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                const body = await response.json();
                setAvatarImage(body.avatar);
            }
        };
        avatar();
    }, []);

    return (
        <div className={'profile-wrapper'} data-theme={props.theme}>
            <NavMenu page={3} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
            <MainContentMyProfile theme={props.theme}/>
        </div>
    );
};

export default MyProfile;