import React from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";

const ProfileUserNameEmailBlock = (props: {
    user: IUser|undefined,
    setUser: React.Dispatch<React.SetStateAction<IUser|undefined>>,
    isEdit: boolean,
}) => {

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
                {!props.isEdit ?
                <div className='my-profile-user-text ma-bot-05'>
                    @{decodeURI(props.user?.userName!)}
                </div> :
                    <div>
                        <input
                            className='login-form-input'
                            type="text"
                            value={props.user?.userName}
                            onChange={(e) => {props.setUser({...props.user!, userName: e.target.value})}}
                        />
                    </div>
                }
            </div>

            <div className='my-profile-user-info-flex'>
                <label className='my-profile-user-label'>
                    {strings.email}
                </label>
                {!props.isEdit ?
                    <div className='my-profile-user-text'>
                        {decodeURI(props.user?.email!)}
                    </div> :
                    <div>
                        <input
                            className='login-form-input'
                            type="email"
                            value={props.user?.email}
                            onChange={(e) => {props.setUser({...props.user!, email: e.target.value})}}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default ProfileUserNameEmailBlock;