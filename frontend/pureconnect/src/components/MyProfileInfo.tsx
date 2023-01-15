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
}) => {

    const [user, setUser] = useState<IUser|undefined>();
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

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(`${props.isEdit ? user?.avatar : ''}`);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            // Implement image to base64
            convertAvatarImageToBase64(reader, file);
            console.log(user?.avatar)
        }
    };

    const convertAvatarImageToBase64 = (reader: FileReader, file: File) => {
        reader.onload = (event) => {
            if (user)
                setUser({...user, avatar: event.target?.result as string});
        };
        reader.readAsDataURL(file);
    }
    return (
        <div>
            {user !== undefined ?
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
                            <img className={'my-profile-user-avatar'} src={isValidAvatar? user?.avatar : userDefault} alt=""/>
                        </div>
                        <ProfileUserNameEmailBlock setUser={setUser} isEdit={props.isEdit} user={user}/>
                    </div>

                    <div className={'my-profile-user-right'}>
                        <MyProfileName setUser={setUser} isEdit={props.isEdit} setIsOpenEditProfile={props.setIsOpenEditProfile} isActiveEditProfile={props.isActiveEditProfile} user={user}/>
                        <ProfileStatusBlock setUser={setUser} isEdit={props.isEdit} user={user}/>
                        <ProfileAdditionalBlock setUser={setUser} isEdit={props.isEdit}  user={user}/>
                    </div>
                </div> :
                <Loader theme={props.theme}/>
            }
        </div>
    );
};

export default MyProfileInfo;