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
import {useNavigate} from "react-router";
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

    const followFollower = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
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
    const unFollowFriend = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
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
    const [isHover, setIsHover] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHover( true );
    };

    const handleMouseLeave = () => {
        setIsHover( false );
    };

    const nav = useNavigate();
    return (
        <div onClick={() => nav(`/user/${props.data?.id}`)} className={`follower-wrapper ${isHover ? 'no-hover' : ''}`}>
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
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => followFollower(e)}>
                        <FollowButton userId={props.data.id}/>
                    </div>
                        :
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => unFollowFriend(e)}>
                        <UnFollowButton userId={props.data.id}/>
                    </div>
                    : isToggleFollow ?
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => unFollowFriend(e)}>
                        <UnFollowButton userId={props.data.id}/>
                    </div>
                        :
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => followFollower(e)}>
                        <FollowButton userId={props.data.id}/>
                    </div>

                }
            </div>
        </div>
    );
};

export default FollowerFriend;