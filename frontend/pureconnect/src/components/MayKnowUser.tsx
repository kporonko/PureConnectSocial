import React from 'react';
import {IMayKnowUser} from "../interfaces/IMayKnowUser";
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {regular, solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import user from "../assets/user.png";
const MayKnowUser = (props:{user: IMayKnowUser}) => {

    let strings = new LocalizedStrings({
        en:{
            common:"common friends",
            follow:"Follow",
        },
        ua: {
            common:"спільних друзів",
            follow:"Підписатися",
        }
    });

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        const image = new Image();
        image.src = props.user.avatar;
        image.onload = () => setIsValidAvatar(true);
        image.onerror = () => setIsValidAvatar(false);
    }, [props.user.avatar]);

    return (
        <div className='may-know-user'>
            <img className='may-know-user-image' src={isValidAvatar? props.user.avatar : user} alt=""/>
            <div  className='may-know-user-name'>
                {props.user.lastName} {props.user.firstName}
            </div>
            <div className='may-know-user-friends-count'>
                {props.user.commonFriendsCount} {strings.common}
            </div>

            <div className='may-know-user-button'>
                <div>
                    <FontAwesomeIcon icon={solid('user-plus')}/>
                </div>
                <div>
                    {strings.follow}
                </div>
            </div>
        </div>
    );
};

export default MayKnowUser;