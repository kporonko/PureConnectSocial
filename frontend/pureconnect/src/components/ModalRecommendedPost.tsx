import React, {SetStateAction, useEffect} from 'react';
import {IPost} from "../interfaces/IPost";
import ModalEditPostTopPanel from "./ModalEditPostTopPanel";
import ModalAddEditPostContent from "./ModalAddEditPostContent";
import ModalRecommendedPostTopPanel from "./ModalRecommendedPostTopPanel";
import ModalRecommendedPostContent from "./ModalRecommendedPostContent";
import {getPostById} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";

const ModalRecommendedPost = (props: {
    post: IPost|undefined,
    setPost: React.Dispatch<SetStateAction<IPost|undefined>>,
    theme: string,
    isActivePostModal: boolean,
    setIsActivePostModal: React.Dispatch<SetStateAction<boolean>>,
    chosenPostId: number,
    setIsOpenUsersLikedPost?: React.Dispatch<SetStateAction<boolean>>,
    setCurrPostIdUsersLiked?: React.Dispatch<SetStateAction<number|undefined>>,
    setIsOpenReportPostModal?: React.Dispatch<SetStateAction<boolean>>,
    setCurrReportPostId?: React.Dispatch<React.SetStateAction<number|undefined>>,
    setCurrentPost: React.Dispatch<React.SetStateAction<IPost|undefined>>,
}) => {
    let strings = new LocalizedStrings({
        en: {
            description: "Description",
            noDescription: "No description available",
            expired: "Your session is expired. PLease sign in again",
            error: "An error has occured"
        },
        ua: {
            description: "Опис",
            noDescription: "Опис відсутній",
            expired: "Ваша сесія закінчилася. Будь-ласка, залогіньтеся знову",
            error: "Сталася помилка"
        }
    });
    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsActivePostModal(false)
    }

    const nav = useNavigate()

    useEffect(() => {
        const getPost = async () => {
            const token = localStorage.getItem('access_token');
            if (token !== null && props.chosenPostId !== undefined) {
                const postResponse = await getPostById(token, Number(props.chosenPostId));
                console.log(postResponse)
                if (postResponse.status === 200) {
                    const post = await postResponse.json();
                    props.setCurrentPost(post);
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
        getPost()
    }, [])

    return (
        <div onClick={closeModal} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-post-content-with-panel">
                {/*<ModalRecommendedPostTopPanel post={props.post} setIsActivePostModal={props.setIsActivePostModal} theme={props.theme}/>*/}
                {props.post && <ModalRecommendedPostContent setCurrentPost={props.setCurrentPost} setIsOpenUsersLikedPost={props.setIsOpenUsersLikedPost} setCurrPostIdUsersLiked={props.setCurrPostIdUsersLiked} setCurrReportPostId={props.setCurrReportPostId} setIsOpenReportPostModal={props.setIsOpenReportPostModal} chosenPostId={props.chosenPostId} theme={props.theme} post={props.post}/>}
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

export default ModalRecommendedPost;
