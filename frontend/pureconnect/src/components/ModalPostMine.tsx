import React, {SetStateAction} from 'react';
import {IPost} from "../interfaces/IPost";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";
import {deletePost, unfollowUserByPost} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const ModalPostMine = (props:{
    post: IPost,
    isOpen: boolean,
    theme: string,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>|undefined,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>,
    isChangedPosts: boolean|undefined,
}) => {

    let strings = new LocalizedStrings({
        en:{
            delete:'Delete post',
            edit:'Edit post',
            goToPost:'Go to post',
            cancel:'Cancel',
            error: "Error. Try again later",
            deletedPost: "Post is deleted",
            expired:"Your session is expired. Please log in again.",
            areSure: "Are you sure?",
            yes: "Yes",
            no: "No",
        },
        ua: {
            delete:'Видалити пост',
            edit:'Редагувати пост',
            goToPost: 'Перейти до посту',
            cancel:'Відмінити',
            error:'Сталася помилка. Спробуйте пізніше',
            deletedPost: 'Пост видалено',
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
            areSure: "Ви впевнені?",
            yes: "Так",
            no: "Ні",
        }
    });

    const nav = useNavigate();

    const handleClose = () => {
        props.setIsOpen(false)
    }

    const confirmWindow = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log('confirmWindow')
        e.preventDefault()
        confirmAlert({
            message: strings.areSure,
            title: 'Confirm To Delete Post',
            buttons:[
                {
                    label: strings.yes,
                    onClick: handleDelete

                },
                {
                    label: strings.no,
                }
            ]
        })
    }
    const handleDelete = async () => {
        console.log('handleDelete')
        const token = localStorage.getItem('access_token');
        if(token !== null) {
            const response = await deletePost(token, props.post.postId)
            console.log(response)
            if(response.status === 200){
                const notify = () => toast.success(strings.deletedPost);
                notify();
                props.setIsOpen(false)
                props.setIsChangedPosts!(!props.isChangedPosts)
            }
            else{
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                    return
                }
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

    const handleEdit = async () => {

    }

    return (
        props.isOpen ? (
            <div className="modal-post-wrapper">
                <div className="modal-home-nav-menu-more-items">
                    <div onClick={handleEdit} className="modal-home-nav-menu-more-item-first">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.edit}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('pen-to-square')}/>
                        </div>
                    </div>
                    <div onClick={(e) => confirmWindow(e)} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.delete}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('bucket')}/>
                        </div>
                    </div>

                    <div onClick={() =>  nav(`/post/${props.post.postId}`)} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.goToPost}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('forward')}/>
                        </div>
                    </div>

                    <div onClick={handleClose} className="modal-post-item-last">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.cancel}
                        </div>
                    </div>
                </div>
            </div>
        ) : <div></div>
    );
};

export default ModalPostMine;