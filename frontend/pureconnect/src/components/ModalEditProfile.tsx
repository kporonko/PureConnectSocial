import React, {SetStateAction} from 'react';
import MyProfile from "../pages/MyProfile";
import MyProfileInfo from "./MyProfileInfo";
import ModalEditPostTopPanel from "./ModalEditPostTopPanel";
import ModalAddEditPostContent from "./ModalAddEditPostContent";
import {IUser} from "../interfaces/IUser";

const ModalEditProfile = (props: {
    isActiveEditProfile: boolean,
    setIsOpenEditProfile: React.Dispatch<SetStateAction<boolean>>,
    theme: string,
    setIsToggleProfile: React.Dispatch<SetStateAction<boolean>>,
    isToggleProfile: boolean,
    setUser: React.Dispatch<SetStateAction<IUser|undefined>>,
    user: IUser|undefined
}) => {

    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsOpenEditProfile(false)
    }

    return (
        <div onClick={closeModal} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} >
                <MyProfileInfo user={props.user} setUser={props.setUser} setIsToggleProfile={props.setIsToggleProfile} isToggleProfile={props.isToggleProfile} isActiveEditProfile={props.isActiveEditProfile} setIsOpenEditProfile={props.setIsOpenEditProfile} isEdit={true} theme={props.theme}/>
            </div>
        </div>
    );
};

export default ModalEditProfile;