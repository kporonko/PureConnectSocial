import React, {useEffect, useState} from 'react';
import NavMenu from "../components/NavMenu";
import MainContentMyProfile from "../components/MainContentMyProfile";
import ModalAddPost from "../components/ModalAddPost";
import ModalEditPost from "../components/ModalEditPost";
import ModalEditProfile from "../components/ModalEditProfile";
import FollowersFriendsListModal from "../components/FollowersFriendsListModal";
import UsersLikedPostModal from "../components/UsersLikedPostModal";
import {toast, ToastContainer} from "react-toastify";
import {getAvatar, GetUserById} from "../utils/FetchData";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import {IUser} from "../interfaces/IUser";
import { IProfile } from '../interfaces/IProfile';
import MainContentUserProfile from "../components/MainContentUserProfile";
import {IPost} from "../interfaces/IPost";
import {IPostImage} from "../interfaces/IPostImage";

const UserPage = (props: {
    theme: string,
    setTheme: any
}) => {

    const {userId} = useParams();

    const [profile, setProfile] = React.useState<IProfile>();

    const [avatarImage, setAvatarImage] = React.useState("");
    const [currPostIdUsersLiked , setCurrPostIdUsersLiked] = useState<number>()
    const [isOpenUsersLikedPost , setIsOpenUsersLikedPost] = useState(false)
    const [isOpenFollowers, setIsOpenFollowers] = useState(false)
    const [isOpenFriends , setIsOpenFriends] = useState(false)
    const [posts, setPosts] = React.useState<IPost[]>();
    const [postsImage, setPostsImage] = React.useState<IPostImage[]>();

    const strings = new LocalizedStrings({
        en: {
            expired: "Your session is expired. Please log in again.",
        },
        ua: {
            expired: "Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    })
    const nav = useNavigate();

    const getProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && userId !== undefined) {
            const responseAvatar = await GetUserById(token, +userId);
            if (responseAvatar.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            const bodyAvatar = await responseAvatar.json();
            setProfile(bodyAvatar.avatar);
        }
    }

    const GetAvatar = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && userId !== undefined) {
            const responseAvatar = await getAvatar(token);
            if (responseAvatar.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            const bodyAvatar = await responseAvatar.json();
            setAvatarImage(bodyAvatar.avatar);
        }
    }

    useEffect(() => {
        GetAvatar();
        getProfile();
    }, [userId])

    return (
        <div className={`profile-wrapper`} data-theme={props.theme}>
            <div>
                <NavMenu page={3} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
                <MainContentUserProfile setCurrPostIdUsersLiked={setCurrPostIdUsersLiked} setIsOpenUsersLikedPost={setIsOpenUsersLikedPost} user={profile} setUser={setProfile} isOpenFollowers={isOpenFollowers} setIsOpenFollowers={setIsOpenFollowers} isOpenFriends={isOpenFriends} setIsOpenFriends={setIsOpenFriends} theme={props.theme} posts={posts} postsImage={postsImage}/>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={props.theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default UserPage;