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
    const [user, setUser] = React.useState<IUser>();

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
            setProfile(bodyAvatar);
            console.log(bodyAvatar)
            if (bodyAvatar?.isMine){
                nav('/my-profile')
            }

            if (bodyAvatar) {
                const userObj = convertProfileToUser(bodyAvatar);
                setUser(userObj);
            }
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

    const convertProfileToUser = (profile: IProfile): IUser => {
        return {
            userId: profile.userId,
            email: profile.email,
            password: '', // Это поле в IUser, но его нет в IProfile - заполняем пустой строкой
            lastName: profile.lastName,
            firstName: profile.firstName,
            location: profile.location,
            birthDate: profile.birthDate,
            avatar: profile.avatar,
            userName: profile.userName,
            status: profile.status,
            postsCount: profile.postsCount,
            followersCount: profile.followersCount,
            friendsCount: profile.friendsCount
        };
    };

    return (
        <div className={`profile-wrapper`} data-theme={props.theme}>
            <div className={`profile-page-wrapper ${(isOpenFollowers || isOpenFriends) && 'content-while-active-modal'}`}>
                <NavMenu page={-1} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
                <MainContentUserProfile setPosts={setPosts} setImagePosts={setPostsImage} userId={userId} setCurrPostIdUsersLiked={setCurrPostIdUsersLiked} setIsOpenUsersLikedPost={setIsOpenUsersLikedPost} user={profile} setUser={setProfile} isOpenFollowers={isOpenFollowers} setIsOpenFollowers={setIsOpenFollowers} isOpenFriends={isOpenFriends} setIsOpenFriends={setIsOpenFriends} theme={props.theme} posts={posts} postsImage={postsImage}/>
            </div>

            {isOpenFollowers &&
                <FollowersFriendsListModal isExternal={true} user={user} setUser={setUser} setIsOpenFollowers={setIsOpenFollowers} isFollowers={true}/>}
            {isOpenFriends &&
                <FollowersFriendsListModal isExternal={true} user={user} setUser={setUser} setIsOpenFriends={setIsOpenFriends} isFollowers={false}/>}

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