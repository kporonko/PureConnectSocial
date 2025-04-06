import React, {SetStateAction} from 'react';
import {IPost} from "../interfaces/IPost";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";
import {followUser, unfollowUser, unfollowUserByPost} from "../utils/FetchData";
import {toast} from "react-toastify";

const ModalPost = (props:{
    post: IPost,
    isOpen: boolean,
    theme: string,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>,
    setIsOpenReportPostModal: React.Dispatch<SetStateAction<boolean>>|undefined,
    setCurrReportPostId: React.Dispatch<React.SetStateAction<number|undefined>>|undefined,
}) => {

    let strings = new LocalizedStrings({
        en:{
            report:"Report",
            unfollow:'Unfollow User',
            goToPost:'Go to post',
            cancel:'Cancel',
            error: "Error. Try again later",
            successUnfollow: 'Unfollowed successfully.',
            follow: 'Follow',
            successFollow: 'Unfollowed successfully.'

        },
        ua: {
            report:"Поскаржитися",
            unfollow:'Відписатися',
            goToPost: 'Перейти до посту',
            cancel:'Відмінити',
            error:'Сталася помилка. Спробуйте пізніше',
            successUnfollow: 'Ви відписалися від користувача.',
            follow: 'Підписатися',
            successFollow: 'Ви підписалися на користувача.'
        }
    });
    const nav = useNavigate();

    const handleReport = () => {
        props.setCurrReportPostId && props.setCurrReportPostId(props.post.postId);
        props.setIsOpenReportPostModal && props.setIsOpenReportPostModal(true);
    }

    const handleClose = () => {
        props.setIsOpen(false)
    }
    console.log(props.post)

    const handleToggleFollow = async () => {
        const token = localStorage.getItem('access_token')

        console.log(props.post)
        if (props.post.isFollowedUser){
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
        else{
            const res = await followUser(token, props.post.userId);
            if (res instanceof Error){
                const notify = () => toast.error(strings.error);
                notify();
            }
            else{
                const notify = () => toast.success(strings.successFollow);
                notify();
            }
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
                    <div onClick={handleToggleFollow} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {props.post.isFollowedUser ? strings.unfollow : strings.follow}
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