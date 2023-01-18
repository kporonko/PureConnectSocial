import React from 'react';
import {IUserLikedPost} from "../interfaces/IUserLikedPost";
import defaultUser from "../assets/user.png";
import {getDate} from "../functions/dateFunctions";
import FollowButton from "./FollowButton";
import UnFollowButton from "./UnFollowButton";
import {useNavigate} from "react-router";
import {followUser, unfollowUser} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";

const UserLikedPost = (props: {
    userLikedPost: IUserLikedPost,
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
    const followFollower = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await followUser(token, props.userLikedPost.id);

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
            const response = await unfollowUser(token, props.userLikedPost.id);

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
    React.useEffect(() => {
        if (props.userLikedPost?.avatar) {
            const image = new Image();
            image.src = props.userLikedPost?.avatar;
            image.onload = () => setIsValidAvatar(true);
            image.onerror = () => setIsValidAvatar(false);
        }
    }, [props.userLikedPost?.avatar]);

    const nav = useNavigate();
    const [isHover, setIsHover] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHover( true );
    };

    const handleMouseLeave = () => {
        setIsHover( false );
    };
    return (
        <div onClick={() => nav(`/user/${props.userLikedPost?.id}`)} className={`follower-wrapper ${isHover ? 'no-hover' : ''}`}>
            <div className={'follower-data-avatar'}>
                <img className={'follower-avatar'} src={isValidAvatar ? props.userLikedPost.avatar : defaultUser} alt=""/>
                <div className={'follower-names'}>
                    <div className={'follower-name'}>
                        {props.userLikedPost.lastName} {props.userLikedPost.firstName}
                    </div>
                    <div className={'follower-username'}>
                        @{props.userLikedPost.userName}
                    </div>
                </div>
            </div>

            <div className={'follower-date-button'}>

                {props.userLikedPost.isMe ? null :
                    props.userLikedPost.isFollowed ?
                    isToggleFollow ?
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => followFollower(e)}>
                            <FollowButton userId={props.userLikedPost.id}/>
                        </div>
                        :
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => unFollowFriend(e)}>
                            <UnFollowButton userId={props.userLikedPost.id}/>
                        </div>
                    : isToggleFollow ?
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => unFollowFriend(e)}>
                            <UnFollowButton userId={props.userLikedPost.id}/>
                        </div>
                        :
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={(e) => followFollower(e)}>
                            <FollowButton userId={props.userLikedPost.id}/>
                        </div>

                }
            </div>
        </div>
    );
};

export default UserLikedPost;