import React from 'react';
import {IFriendFollower} from "../interfaces/IFriendFollower";
import {getDate} from "../functions/dateFunctions";
import FollowButton from "./FollowButton";
import defaultUser from '../assets/user.png'
import UnFollowButton from "./UnFollowButton";
const FollowerFriend = (props: {
    data: IFriendFollower,
    isFriend: boolean,
}) => {

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        if (props.data?.avatar) {
            const image = new Image();
            image.src = props.data?.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.data?.avatar]);

    return (
        <div className={'follower-wrapper'}>
            <div className={'follower-data-avatar'}>
                <img className={'follower-avatar'} src={isValidAvatar ? props.data.avatar : defaultUser} alt=""/>
                <div className={'follower-names'}>
                    <div className={'follower-name'}>
                        {props.data.lastName} {props.data.firstName}
                    </div>
                    <div className={'follower-username'}>
                        @{props.data.userName}
                    </div>
                </div>
            </div>

            <div className={'follower-date-button'}>
                <div className={'follower-date-wrapper'}>
                    {getDate(props.data.followDate)}
                </div>
                {props.isFriend ?
                    <UnFollowButton userId={props.data.id}/>
                    :
                    <FollowButton userId={props.data.id}/>

                }</div>
        </div>
    );
};

export default FollowerFriend;