import React, {SetStateAction} from 'react';
import {IPost} from "../interfaces/IPost";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";
import {unfollowUserByPost} from "../utils/FetchData";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

const ModalPostMine = (props:{post: IPost, isOpen: boolean, theme: string, setIsOpen: React.Dispatch<SetStateAction<boolean>>}) => {

    let strings = new LocalizedStrings({
        en:{
            delete:'Delete post',
            edit:'Edit post',
            goToPost:'Go to post',
            cancel:'Cancel',
            error: "Error. Try again later",
        },
        ua: {
            delete:'Видалити пост',
            edit:'Редагувати пост',
            goToPost: 'Перейти до посту',
            cancel:'Відмінити',
            error:'Сталася помилка. Спробуйте пізніше',
        }
    });

    const nav = useNavigate();

    const handleClose = () => {
        props.setIsOpen(false)
    }

    const handleDelete = () => {

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
                    <div onClick={handleDelete} className="modal-home-nav-menu-more-item">
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