import React, {SetStateAction} from 'react';
import {IUser} from "../interfaces/IUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {editUser} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IProfile} from "../interfaces/IProfile";

const ProfileName = (props: {
    user: IProfile|undefined
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

    console.log(props.user)
    return (
        <div className='profile-user-name-edit-wrapper'>
                <div className={'profile-user-name'}>
                    {props.user?.lastName} {props.user?.firstName}
                </div>
        </div>
    );
};

export default ProfileName;