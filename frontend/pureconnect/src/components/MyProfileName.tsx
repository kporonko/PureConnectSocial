import React from 'react';
import {IUser} from "../interfaces/IUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";

const MyProfileName = (props: {user: IUser|undefined}) => {

    let strings = new LocalizedStrings({
        en:{
            edit: "Edit profile"
        },
        ua: {
            edit: 'Редагувати профіль'
        }
    });

    return (
        <div className='profile-user-name-edit-wrapper'>
            <div className={'profile-user-name'}>
                {props.user?.lastName} {props.user?.firstName}
            </div>

            <div className={'profile-user-edit'}>
                <FontAwesomeIcon icon={solid('edit')}/>
                {strings.edit}
            </div>
        </div>
    );
};

export default MyProfileName;