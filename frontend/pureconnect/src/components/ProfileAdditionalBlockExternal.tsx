import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {getDate} from "../functions/dateFunctions";
import {IProfile} from "../interfaces/IProfile";

const ProfileAdditionalBlockExternal = (props: {
    user: IProfile|undefined,
}) => {

    let strings = new LocalizedStrings({
        en:{
            additional: 'Additional Information',
        },
        ua: {
            additional: 'Додаткова інформація',
        }
    });

    return (
        <div className={'profile-user-additional-wrapper'}>
            <h6 className={'my-profile-user-label'}>
                {strings.additional}
            </h6>
            <div className={'profile-user-additional-location'}>
                <FontAwesomeIcon icon={solid('location-dot')}/>
                {props.user?.location === undefined || props.user.location === null || props.user.location.length === 0 ?
                    <div className={'no-location'}>
                        No location
                    </div> :
                    <div>
                        {props.user?.location}
                    </div>
                }
            </div>

            <div className={'profile-user-additional-birth-date'}>
                <FontAwesomeIcon icon={solid('birthday-cake')}/>
                <div>
                    {getDate(new Date(props.user?.birthDate!))}
                </div>
            </div>

        </div>
    );
};

export default ProfileAdditionalBlockExternal;