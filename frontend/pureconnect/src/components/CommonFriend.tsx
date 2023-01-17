import React from 'react';
import {ICommonFriend} from "../interfaces/ICommonFriend";
import defaultUser from "../assets/user.png";
import {getDate} from "../functions/dateFunctions";
import FollowButton from "./FollowButton";
import UnFollowButton from "./UnFollowButton";
import {useNavigate} from "react-router";
import {getCommonFriends} from "../utils/FetchData";

const CommonFriend = (props: {
    friend: ICommonFriend,
    setCommonFriends: React.Dispatch<React.SetStateAction<ICommonFriend[]|undefined>>,
}) => {

    const nav = useNavigate();
    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        if (props.friend?.avatar) {
            const image = new Image();
            image.src = props.friend?.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.friend]);


    return (
        <div onClick={() => nav(`/user/${props.friend?.id}`)} className={`follower-wrapper`}>
            <div className={'follower-data-avatar'}>
                <img className={'follower-avatar'} src={isValidAvatar ? props.friend.avatar : defaultUser} alt=""/>
                <div className={'follower-names'}>
                    <div className={'follower-name'}>
                        {props.friend.lastName} {props.friend.firstName}
                    </div>
                    <div className={'follower-username'}>
                        @{props.friend.userName}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonFriend;