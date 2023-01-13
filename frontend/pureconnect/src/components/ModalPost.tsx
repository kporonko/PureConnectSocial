import React, {SetStateAction} from 'react';
import {IPost} from "../interfaces/IPost";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";
import {followUser, unfollowUser, unfollowUserByPost} from "../utils/FetchData";
import {toast} from "react-toastify";

const ModalPost = (props:{post: IPost, isOpen: boolean, theme: string, setIsOpen: React.Dispatch<SetStateAction<boolean>>}) => {

    let strings = new LocalizedStrings({
        en:{
            report:"Report",
            unfollow:'Unfollow User',
            goToPost:'Go to post',
            cancel:'Cancel',
            error: "Error. Try again later",
            successUnfollow: 'Unfollowed successfully.'
        },
        ua: {
            report:"Поскаржитися",
            unfollow:'Відписатися',
            goToPost: 'Перейти до посту',
            cancel:'Відмінити',
            error:'Сталася помилка. Спробуйте пізніше',
            successUnfollow: 'Ви відписалися від користувача.'
        }
    });
    const nav = useNavigate();

    const handleReport = () => {

    }

    const handleClose = () => {
        props.setIsOpen(false)
    }

    const handleUnfollow = async () => {
        const token = localStorage.getItem('access_token')

        const res = await unfollowUserByPost(token, props.post.postId);
        if (res instanceof Error){
            const notify = () => toast.error(strings.error);
            notify();
        }
        else{
            const notify = () => toast.success(strings.successUnfollow);
            notify();
        }
    }

    return (
        props.isOpen ? (
            <div className="modal-post-wrapper">
                <div className="modal-home-nav-menu-more-items">
                    <div onClick={handleReport} className="modal-home-nav-menu-more-item-first">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.report}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('exclamation-circle')}/>
                        </div>
                    </div>
                    <div onClick={handleUnfollow} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.unfollow}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('user-xmark')}/>
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

export default ModalPost;