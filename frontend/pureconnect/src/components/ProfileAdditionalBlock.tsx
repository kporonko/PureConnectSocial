import React from 'react';
import {IUser} from "../interfaces/IUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {getDate} from "../functions/dateFunctions";

const ProfileAdditionalBlock = (props: {
    user: IUser|undefined,
    isEdit: boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser|undefined>>,
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
            {!props.isEdit ?
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
            </div> :
                <div className={'profile-user-additional-location'}>
                    <FontAwesomeIcon icon={solid('location-dot')}/>
                    <div style={{width:'100%', maxHeight:'60px'}}>
                        <input
                            style={{width:'93%'}}
                            className='login-form-input'
                            type="text"
                            value={props.user?.location}
                            onChange={(e) => {props.setUser({...props.user!, location: e.target.value})}}
                        />
                    </div>
                </div>
            }
            {!props.isEdit ?
            <div className={'profile-user-additional-birth-date'}>
                <FontAwesomeIcon icon={solid('birthday-cake')}/>
                <div>
                    {getDate(new Date(props.user?.birthDate!))}
                </div>
            </div>
                :
                <div className={'profile-user-additional-birth-date'}>
                    <FontAwesomeIcon icon={solid('birthday-cake')}/>
                    <div style={{width:'90%', maxHeight:'60px'}}>
                        <input
                            style={{width:'90%'}}
                            className='login-form-input'
                            type="date"
                            value={props.user?.birthDate.substring(0,10)}
                            placeholder={'Birth date'}
                            onChange={(e) => {props.setUser({...props.user!, birthDate: e.target.value})}}
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default ProfileAdditionalBlock;