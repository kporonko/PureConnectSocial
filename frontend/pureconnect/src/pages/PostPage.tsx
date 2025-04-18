import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import navMenu from "../components/NavMenu";
import {getAvatar, getPostById} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import LocalizedStrings from "react-localization";
import {IPost} from "../interfaces/IPost";
import PostPageContent from "../components/PostPageContent";
import Loader from "../components/Loader";
import NavMenu from "../components/NavMenu";
import ModalEditPost from "../components/ModalEditPost";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import ModalReport from "../components/ModalReport";

const PostPage = (props: {theme: string, setTheme: any}) => {

    const {postId} = useParams();
    const nav = useNavigate();

    const [post, setPost] = React.useState<IPost>();
    const [postEdit, setPostEdit] = React.useState<IPostAddRequest>(post as IPostAddRequest);

    const [avatar, setAvatar] = React.useState<string>("");

    const strings = new LocalizedStrings({
        en:{
            expired:"Your session is expired. Please log in again.",
            error:"Something went wrong. Please try again later."
        },
        ru: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
            error:"Щось пішло не так. Будь ласка, спробуйте пізніше."
        },
    })

    const getPost = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && postId !== undefined) {
            const postResponse = await getPostById(token, Number(postId));
            if (postResponse.status === 200) {
                const post = await postResponse.json();
                setPost(post);
                setPostEdit(post);
            }
            else if (postResponse.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            else {
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

    const getAvatarImage = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null) {
            const response = await getAvatar(token);
            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            const body = await response.json();
            setAvatar(body.avatar);
        }
    }
    const [isChangedPost, setIsChangedPost] = React.useState<boolean>(false);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const post = getPost();
        const avatar = getAvatarImage();
    }, [postId, isChangedPost])

    const [isActiveEditPost, setIsActiveEditPost] = React.useState<boolean>(false);

    const [isOpenReportPostModal, setIsOpenReportPostModal] = useState(false);
    return (
        <div className={''} data-theme={props.theme}>
            <div className={isActiveEditPost ? `dark profile-wrapper` : 'profile-wrapper'}>
                <NavMenu page={-1} theme={props.theme} setTheme={props.setTheme} avatar={avatar}/>
                <PostPageContent setIsOpenReportPostModal={setIsOpenReportPostModal} setIsActiveEditPost={setIsActiveEditPost} theme={props.theme} post={post} setPost={setPost}/>
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
            {isActiveEditPost &&
                <ModalEditPost isChangedPosts={isChangedPost} setIsChangedPosts={setIsChangedPost} post={postEdit} setPost={setPostEdit} theme={props.theme} isActiveEditPost={isActiveEditPost} setIsActiveEditPost={setIsActiveEditPost}/>}
            {isOpenReportPostModal && postId !== undefined &&
                <ModalReport isPost={true} postId={+postId} isModalReportOpen={isOpenReportPostModal} setIsModalReportOpen={setIsOpenReportPostModal}/>}

        </div>
    );
};

export default PostPage;