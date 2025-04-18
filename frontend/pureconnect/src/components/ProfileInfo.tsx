import React, {ChangeEvent, SetStateAction, useEffect, useRef, useState} from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";
import ProfileUserNameEmailBlock from "./ProfileUserNameEmailBlock";
import ProfileStatusBlock from "./ProfileStatusBlock";
import MyProfileName from "./MyProfileName";
import ProfileAdditionalBlock from "./ProfileAdditionalBlock";
import {getMyProfile, getProfile} from "../utils/FetchData";
import {useNavigate} from "react-router";
import userDefault from "../assets/user.png";
import Loader from "./Loader";
import {useParams} from "react-router-dom";
import {IProfile} from "../interfaces/IProfile";
import ProfileName from "./ProfileName";
import ProfileAdditionalBlockExternal from "./ProfileAdditionalBlockExternal";
import ProfileStatusBlockExternal from "./ProfileStatusBlockExternal";
import ProfileUserNameEmailBlockExternal from "./ProfileUserNameEmailBlockxternal";

const ProfileInfo = (props: {
    theme: string,
    isOpenFollowers?: boolean,
    setIsOpenFollowers?: React.Dispatch<SetStateAction<boolean>>,
    isOpenFriends?: boolean,
    setIsOpenFriends?: React.Dispatch<SetStateAction<boolean>>,
    user?: IProfile|undefined,
    setUser?: React.Dispatch<SetStateAction<IProfile|undefined>>,
}) => {


    const {userId} = useParams();

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('access_token')
            if (token && userId !== undefined) {
                const response = await getProfile(token, Number(userId));
                console.log(response)

                props.setUser!(response)
            }
        }
        getUser()
    }, [])

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        if (props.user?.avatar) {
            const image = new Image();
            image.src = props.user.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.user]);


    return (
        <div className={'main-content-profile-block'}>
            {props.user !== undefined ?
                <div className='my-profile-user-grid'>
                    <div className={'my-profile-user-left'}>
                        <div>
                            <img className={'my-profile-user-avatar'} src={isValidAvatar? props.user?.avatar : userDefault} alt=""/>
                        </div>

                        <ProfileUserNameEmailBlockExternal user={props.user}/>
                    </div>

                    <div className={'my-profile-user-right'}>
                        <div>
                            <ProfileName user={props.user}/>
                            <ProfileStatusBlockExternal isOpenFollowers={props.isOpenFollowers} setIsOpenFollowers={props.setIsOpenFollowers} isOpenFriends={props.isOpenFriends} setIsOpenFriends={props.setIsOpenFriends} user={props.user}/>
                            <ProfileAdditionalBlockExternal user={props.user}/>
                        </div>
                    </div>
                </div> :
                <Loader theme={props.theme}/>
            }
        </div>
    );
};

export default ProfileInfo;