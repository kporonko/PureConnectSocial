import React, {SetStateAction} from 'react';
import {IUser} from "../interfaces/IUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {editUser} from "../utils/FetchData";
import {toast} from "react-toastify";

const MyProfileName = (props: {
    user: IUser|undefined,
    isActiveEditProfile: boolean,
    setIsOpenEditProfile: React.Dispatch<SetStateAction<boolean>>,
    isEdit: boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser|undefined>>,
    isToggleProfile?: boolean,
    setIsToggleProfile?: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    let strings = new LocalizedStrings({
        en:{
            edit: "Edit profile",
            save: "Save",
            updatedProfile: "Profile is updated",
            error: "Error",
        },
        ua: {
            edit: 'Редагувати профіль',
            save: 'Зберегти',
            updatedProfile: 'Профіль оновлено',
            error: 'Помилка',
        }
    });

    const handleOpenEditProfileModal = () => {
        props.setIsOpenEditProfile(true)
    }

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await editUser(token, props.user!)
            if (response.status === 200) {
                const notify = () => toast.success(strings.updatedProfile);
                notify();
                props.setIsOpenEditProfile(false)
                console.log(props.isToggleProfile)
                props.setIsToggleProfile!(!props.isToggleProfile)
                // setTimeout(() => {
                //     window.location.reload()
                // }, 1000)
            }
            else {
                const notify = () => toast.error(response.error);
                notify();
            }
        }
    }

    return (
        <div className='profile-user-name-edit-wrapper'>
            {!props.isEdit ?
            <div className={'profile-user-name'}>
                {props.user?.lastName} {props.user?.firstName}
            </div> :
                <div style={{display:'flex', gap:'5%'}}>
                    <div>
                        <label className={'my-profile-user-label'} htmlFor="">Last Name</label>
                        <input
                            className='login-form-input'
                            type="text"
                            value={props.user?.lastName}
                            onChange={(e) => {props.setUser({...props.user!, lastName: e.target.value})}}
                        />
                    </div>
                    <div>
                        <label className={'my-profile-user-label'} htmlFor="">First Name</label>
                        <input
                            className='login-form-input'
                            type="text"
                            value={props.user?.firstName}
                            onChange={(e) => {props.setUser({...props.user!, firstName: e.target.value})}}
                        />
                    </div>
                </div>
            }
            {!props.isEdit ?
            <div onClick={handleOpenEditProfileModal} className={'profile-user-edit'}>
                <FontAwesomeIcon icon={solid('edit')}/>
                {strings.edit}
            </div>
                :
            <div onClick={handleSaveProfile} style={{fontSize: '1.5rem', marginLeft:'2rem'}} className={'profile-user-edit'}>
                <FontAwesomeIcon icon={solid('save')}/>
                {strings.save}
            </div>}
        </div>
    );
};

export default MyProfileName;