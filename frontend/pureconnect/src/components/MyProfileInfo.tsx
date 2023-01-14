import React, {useEffect, useRef, useState} from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";
import ProfileUserNameEmailBlock from "./ProfileUserNameEmailBlock";
import ProfileStatusBlock from "./ProfileStatusBlock";
import MyProfileName from "./MyProfileName";
import ProfileAdditionalBlock from "./ProfileAdditionalBlock";
import {getMyProfile} from "../utils/FetchData";
import {useNavigate} from "react-router";
import userDefault from "../assets/user.png";
import Loader from "./Loader";

const MyProfileInfo = (props: {theme: string}) => {

    const [user, setUser] = useState<IUser>()
    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('access_token')
            if (token) {
                const response = await getMyProfile(token);
                setUser(response)
            }
        }
        getUser()
    }, [])

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        if (user?.avatar) {
            const image = new Image();
            image.src = user.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [user]);

    return (
        <div>
            {user !== undefined ?
                <div className='my-profile-user-grid'>
                    <div className={'my-profile-user-left'}>
                        <img className={'my-profile-user-avatar'} src={isValidAvatar? user?.avatar : userDefault} alt=""/>
                        <ProfileUserNameEmailBlock user={user}/>
                    </div>

                    <div className={'my-profile-user-right'}>
                        <MyProfileName user={user}/>
                        <ProfileStatusBlock user={user}/>
                        <ProfileAdditionalBlock user={user}/>
                    </div>
                </div> :
                <Loader theme={props.theme}/>
            }
        </div>
    );
};

export default MyProfileInfo;