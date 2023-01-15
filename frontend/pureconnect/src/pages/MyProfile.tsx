import React, {SetStateAction, useEffect, useState} from 'react';
import NavMenu from "../components/NavMenu";
import {getAvatar, getMyPosts} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import MainContentHome from "../components/MainContentHome";
import MainContentMyProfile from "../components/MainContentMyProfile";
import Post from "../components/Post";
import {IPost} from "../interfaces/IPost";
import MyPostsList from "../components/MyPostsList";
import ModalAddPost from "../components/ModalAddPost";
import {IPostImage} from "../interfaces/IPostImage";
import ModalEditPost from "../components/ModalEditPost";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

const MyProfile = (props:{theme: string, setTheme: any}) => {

    const [avatarImage, setAvatarImage] = React.useState("");
    const [isActiveAddPost, setIsActiveAddPost] = React.useState(false);

    const [posts, setPosts] = React.useState<IPost[]>();
    const [postsImage, setPostsImage] = React.useState<IPostImage[]>();

    const nav = useNavigate();
    let strings = new LocalizedStrings({
        en:{
            expired:"Your session is expired. Please log in again.",
        },
        ua: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    });

    useEffect( () => {
        const getUserData = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responseAvatar = await getAvatar(token);
                if (responseAvatar.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                const bodyAvatar = await responseAvatar.json();
                setAvatarImage(bodyAvatar.avatar);
            }
        };
        getUserData();
    }, []);
    const [isChangedPosts, setIsChangedPosts] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [post, setPost] = useState<IPostAddRequest>({description: '', createdAt: undefined, image: '', postId: undefined});

    console.log(isOpenEdit)

    return (
        <div className={`profile-wrapper`} data-theme={props.theme}>
            <div className={`${(isActiveAddPost || isOpenEdit) && 'content-while-active-modal'}`}>
                <NavMenu page={3} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
                {<MainContentMyProfile isOpenEdit={isOpenEdit} setIsOpenEdit={setIsOpenEdit} postEdit={post} setPostEdit={setPost} isChangedPosts={isChangedPosts} setIsChangedPosts={setIsChangedPosts} theme={props.theme} posts={posts} postsImage={postsImage} setIsActiveAddPost={setIsActiveAddPost} setPosts={setPosts} setImages={setPostsImage}/>}
            </div>
            {isActiveAddPost &&
                <ModalAddPost setIsChangedPosts={setIsChangedPosts} isChangedPosts={isChangedPosts} posts={posts} postsImage={postsImage} setPosts={setPosts} setImages={setPostsImage} theme={props.theme} isActiveAddPost={isActiveAddPost} setIsActiveAddPost={setIsActiveAddPost}/>}
            {isOpenEdit &&
                <ModalEditPost isActiveEditPost={isOpenEdit} setIsActiveEditPost={setIsOpenEdit} theme={props.theme} setIsChangedPosts={setIsChangedPosts} isChangedPosts={isChangedPosts} post={post} setPost={setPost}/>}

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

export default MyProfile;