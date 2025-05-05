import React, { useState, useEffect } from 'react';
import NavMenu, {Page} from '../components/NavMenu';
import MainContentMyProfile from "../components/MainContentMyProfile";
import MainContentSearch from "../components/MainContentSearch";
import MainContentHome from "../components/MainContentHome";
import {getAvatar, getPostById} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import ModalAddPost from "../components/ModalAddPost";
import ModalEditPost from "../components/ModalEditPost";
import ModalRecommendedPostContent from "../components/ModalRecommendedPostContent";
import {IPost} from "../interfaces/IPost";
import ModalRecommendedPost from "../components/ModalRecommendedPost"; // Adjust the import path as needed

interface SearchPageProps {
    theme: string;
    setTheme: (theme: string) => void;
}

interface SearchResult {
    id: number;
    title: string;
}

const SearchPage: React.FC<SearchPageProps> = (props) => {

    const [avatarImage, setAvatarImage] = React.useState("");

    const [isActivePostModal, setIsActivePostModal] = React.useState(false);
    const [chosenPostId, setChosenPostId] = React.useState<number>();

    console.log(isActivePostModal)
    const [currentPost, setCurrentPost] = React.useState<IPost>();

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

    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <div className={`home-wrapper-2 ${isActivePostModal && 'content-while-active-modal'}`}>
                <NavMenu page={Page.Search} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
                <MainContentSearch setChosenPostId={setChosenPostId} chosenPostId={chosenPostId} theme={props.theme} isActivePostModal={isActivePostModal} setIsActivePostModal={setIsActivePostModal}/>
            </div>

            {isActivePostModal && chosenPostId &&
                <ModalRecommendedPost setCurrentPost={setCurrentPost} isActivePostModal={isActivePostModal} setIsActivePostModal={setIsActivePostModal} chosenPostId={chosenPostId} theme={props.theme} post={currentPost} setPost={setCurrentPost}/>}

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

export default SearchPage;