import React, {SetStateAction, useEffect} from 'react';
import FollowerTopPanel from "./FollowerTopPanel";
import FriendTopPanel from "./FriendTopPanel";
import FollowerFriend from "./FollowerFriend";
import UsersLikedPostTopPanel from "./UsersLikedPostTopPanel";
import {IUserLikedPost} from "../interfaces/IUserLikedPost";
import UserLikedPost from "./UserLikedPost";
import {IUser} from "../interfaces/IUser";
import {getUsersLikedPost} from "../utils/FetchData";
import {toast} from "react-toastify";
import LocalizedStrings from "react-localization";

const UsersLikedPostModal = (props: {
    setIsOpenUsersLikedPost: React.Dispatch<SetStateAction<boolean>>,
    user: IUser | undefined,
    setUser: React.Dispatch<SetStateAction<IUser | undefined>>,
    postId: number|undefined,
}) => {

    const strings = new LocalizedStrings({
        en:{
            error:"Something went wrong",
        },
        ua: {
            error:"Щось пішло не так",
        }
    });
    const [usersLikedPost, setUsersLikedPost] = React.useState<IUserLikedPost[]>();

    const closeModal = () => {
        props.setIsOpenUsersLikedPost(false)
    }
    const getUsersLikedPostList = async () => {
        const token = localStorage.getItem('access_token')
        if (token && props.postId) {
            const response = await getUsersLikedPost(token, props.postId)
            if (response.status === 200) {
                const body = await response.json()
                setUsersLikedPost(body)
            }
            else {
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

    useEffect(() => {
        getUsersLikedPostList()
    },[])

    return (
        <div onClick={closeModal} className={'modal-followers-friends-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-followers-friends-content">
                <UsersLikedPostTopPanel/>
                {usersLikedPost && usersLikedPost.map((userLikedPost, index) => (
                    <UserLikedPost setUser={props.setUser} user={props.user} key={index} userLikedPost={userLikedPost}/>
                ))}
            </div>
        </div>
    );
};

export default UsersLikedPostModal;