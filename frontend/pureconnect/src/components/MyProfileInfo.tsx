import React, {ChangeEvent, SetStateAction, useEffect, useRef, useState} from 'react';
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

const MyProfileInfo = (props: {
    theme: string,
    isEdit: boolean,
    isActiveEditProfile: boolean,
    setIsOpenEditProfile: React.Dispatch<SetStateAction<boolean>>,
    setIsToggleProfile: React.Dispatch<SetStateAction<boolean>>,
    isToggleProfile: boolean,
    isOpenFollowers?: boolean,
    setIsOpenFollowers?: React.Dispatch<SetStateAction<boolean>>,
    isOpenFriends?: boolean,
    setIsOpenFriends?: React.Dispatch<SetStateAction<boolean>>,
    user?: IUser|undefined,
    setUser?: React.Dispatch<SetStateAction<IUser|undefined>>,
    isMine?: boolean
}) => {

    const [user, setUser] = useState<IUser|undefined>(props.user);

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('access_token')
            if (token) {
                const response = await getMyProfile(token);
                if (props.isEdit)
                    setUser(response);
                else
                    props.setUser!(response)
            }
        }
        getUser()
    }, [props.isToggleProfile])

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        if (props.user?.avatar) {
            const image = new Image();
            image.src = props.user.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.user]);

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(`${props.isEdit ? props.user?.avatar : ''}`);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            // Implement image to base64
            convertAvatarImageToBase64(reader, file);
        }
    };

    const convertAvatarImageToBase64 = (reader: FileReader, file: File) => {
        reader.onload = (event) => {
            if (props.user)
                setUser!({...user!, avatar: event.target?.result as string});
        };
        reader.readAsDataURL(file);
    }
    return (
        <div>
            {props.user !== undefined ?
                <div className='my-profile-user-grid'>
                    <div className={'my-profile-user-left'}>
                        <div className={props.isEdit ? 'flex-column' : ''}>
                            {props.isEdit &&
                                <input
                                    type="file"
                                    ref={fileInput}
                                    accept="image/*"
                                    onChange={(e) => handleChange(e)}
                                />
                            }
                            {props.isEdit ?
                            <img className={'my-profile-user-avatar'} src={isValidAvatar? user?.avatar : userDefault} alt=""/>
                                :
                            <img className={'my-profile-user-avatar'} src={isValidAvatar? props.user?.avatar : userDefault} alt=""/>}
                        </div>
                        {props.isEdit ?
                        <ProfileUserNameEmailBlock setUser={setUser!} isEdit={props.isEdit} user={user}/>
                            :
                        <ProfileUserNameEmailBlock setUser={props.setUser!} isEdit={props.isEdit} user={props.user}/>}
                    </div>

                    <div className={'my-profile-user-right'}>
                        {props.isEdit ?
                            <div>
                                <MyProfileName setIsToggleProfile={props.setIsToggleProfile} isToggleProfile={props.isToggleProfile} setUser={setUser!} isEdit={props.isEdit} setIsOpenEditProfile={props.setIsOpenEditProfile} isActiveEditProfile={props.isActiveEditProfile} user={user}/>
                                <ProfileStatusBlock isOpenFollowers={props.isOpenFollowers} setIsOpenFollowers={props.setIsOpenFollowers} isOpenFriends={props.isOpenFriends} setIsOpenFriends={props.setIsOpenFriends}  setUser={setUser!} isEdit={props.isEdit} user={user}/>
                                <ProfileAdditionalBlock setUser={setUser!} isEdit={props.isEdit} user={user}/>
                            </div> :
                            <div>
                                <MyProfileName setIsToggleProfile={props.setIsToggleProfile} isToggleProfile={props.isToggleProfile} setUser={props.setUser!} isEdit={props.isEdit} setIsOpenEditProfile={props.setIsOpenEditProfile} isActiveEditProfile={props.isActiveEditProfile} user={props.user}/>
                                <ProfileStatusBlock isOpenFollowers={props.isOpenFollowers} setIsOpenFollowers={props.setIsOpenFollowers} isOpenFriends={props.isOpenFriends} setIsOpenFriends={props.setIsOpenFriends}  setUser={props.setUser!} isEdit={props.isEdit} user={props.user}/>
                                <ProfileAdditionalBlock setUser={props.setUser!} isEdit={props.isEdit} user={props.user}/>
                            </div>}
                        </div>
                </div> :
                <Loader theme={props.theme}/>
            }
        </div>
    );
};

export default MyProfileInfo;