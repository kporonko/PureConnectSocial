import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {regular, solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {IPost} from "../interfaces/IPost";
import {likePost, unLikePost} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";

const PostActionsPanel = (props: {post: IPost, theme: string}) => {

    const [isLike, setIsLike] = useState(props.post.isLike)
    const [likeCount, setLikeCount] = useState(props.post.likesCount)

    let strings = new LocalizedStrings({
        en:{
            likeCount: 'people like it',
            commentCount: 'comments',
            error: "Error. Try again later"
        },
        ua: {
            likeCount: 'людям подобається',
            commentCount: 'коментарів',
            error:"Сталася помилка. Спробуйте пізніше"
        }
    });

    const likeHandle = async () => {
        const token = localStorage.getItem('access_token');

        if (!isLike){
            const resLike = await likePost(token, props.post.postId);
            if (resLike instanceof Error || resLike.status !== 200){
                const notify = () => toast.error(strings.error);
                notify();
            }
            else{
                setIsLike(true)
                setLikeCount(likeCount + 1)
            }
        }
        else{
            const resUnlike = await unLikePost(token, props.post.postId);
            if (resUnlike instanceof Error || resUnlike.status !== 200){
                const notify = () => toast.error(strings.error);
                notify();
            }
            else {
                setIsLike(false)
                setLikeCount(likeCount - 1)
            }
        }
    }

    return (
        <div className={'post-actions-wrapper'}>
            <div className={'post-action'}>
                <div onClick={likeHandle} className='post-action-icon'>
                    {isLike ?
                        <FontAwesomeIcon className={'heart-fill'} icon={solid('heart')}/> :
                        <FontAwesomeIcon icon={regular('heart')}/>
                    }
                </div>

                <div className='post-action-desc'>
                    {likeCount} {strings.likeCount}
                </div>
            </div>
            <div className={'post-action'}>
                <div className='post-action-icon'>
                    <FontAwesomeIcon icon={regular('comment')}/>
                </div>

                <div className='post-action-desc'>
                    {props.post.commentsCount} {strings.commentCount}
                </div>
            </div>

            <div className={'post-action'}>
                <div className='post-action-icon'>
                    <FontAwesomeIcon icon={regular('paper-plane')}/>
                </div>
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

export default PostActionsPanel;