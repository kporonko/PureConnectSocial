import React from 'react';
import {IFriendFollower} from "../interfaces/IFriendFollower";
import {getDate} from "../functions/dateFunctions";
import FollowButton from "./FollowButton";
import defaultUser from '../assets/user.png'
import UnFollowButton from "./UnFollowButton";
import {followUser, unfollowUser} from "../utils/FetchData";
import {toast} from "react-toastify";
import LocalizedStrings from "react-localization";
import {IUser} from "../interfaces/IUser";
const FollowerFriend = (props: {
    data: IFriendFollower,
    isFriend: boolean,
    user: IUser|undefined,
    setUser: React.Dispatch<React.SetStateAction<IUser|undefined>>
}) => {

    const strings = new LocalizedStrings({
        en:{
            successFollow:"You have successfully followed this user",
            successUnFollow:"You have successfully unfollowed this user",
            error:"Something went wrong",
        },
        ua: {
            successFollow:"Ви успішно підписалися на цього користувача",
            successUnFollow:"Ви успішно відписалися від цього користувача",
            error:"Щось пішло не так",
        }
    });
    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    const [isToggleFollow, setIsToggleFollow] = React.useState(false);

    React.useEffect(() => {
        if (props.data?.avatar) {
            const image = new Image();
            image.src = props.data?.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.data?.avatar]);

    const followFollower = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await followUser(token, props.data.id);

            if (response.status === 200) {
                props.setUser({...props.user!, followersCount: props.user!.followersCount - 1, friendsCount: props.user!.friendsCount + 1})

                setIsToggleFollow(!isToggleFollow);
                const notify = () => toast.success(strings.successFollow);
                notify();
            }
            else{
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }
    const unFollowFriend = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await unfollowUser(token, props.data.id);

            if (response.status === 200) {
                props.setUser({...props.user!, followersCount: props.user!.followersCount + 1, friendsCount: props.user!.friendsCount - 1})
                setIsToggleFollow(!isToggleFollow);
                const notify = () => toast.success(strings.successUnFollow);
                notify();
            }
            else{
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

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
                    isToggleFollow ?
                    <div onClick={followFollower}>
                        <FollowButton userId={props.data.id}/>
                    </div>
                        :
                    <div onClick={unFollowFriend}>
                        <UnFollowButton userId={props.data.id}/>
                    </div>
                    : isToggleFollow ?
                    <div onClick={unFollowFriend}>
                        <UnFollowButton userId={props.data.id}/>
                    </div>
                        :
                    <div onClick={followFollower}>
                        <FollowButton userId={props.data.id}/>
                    </div>

                }
            </div>
        </div>
    );
};

export default FollowerFriend;