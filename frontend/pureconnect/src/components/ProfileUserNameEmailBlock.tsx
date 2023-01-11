import React from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";

const ProfileUserNameEmailBlock = (props: {user: IUser|undefined}) => {

    let strings = new LocalizedStrings({
        en:{
            username:"Username",
            email:"Email",
        },
        ua: {
            username:'Нікнейм',
            email:'Електронна пошта',
        }
    });

    return (
        <div className={'my-profile-user-left-bot'}>
            <div className='my-profile-user-info-flex'>
                <label className='my-profile-user-label'>
                    {strings.username}
                </label>
                <div className='my-profile-user-text ma-bot-05'>
                    @{decodeURI(props.user?.userName!)}
                </div>
            </div>

            <div className='my-profile-user-info-flex'>
                <label className='my-profile-user-label'>
                    {strings.email}
                </label>
                <div className='my-profile-user-text'>
                    {decodeURI(props.user?.email!)}
                </div>
            </div>
        </div>
    );
};

export default ProfileUserNameEmailBlock;