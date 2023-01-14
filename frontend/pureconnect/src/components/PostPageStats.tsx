import React, {useState} from 'react';
import {IPost} from "../interfaces/IPost";
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {likePost, unLikePost} from "../utils/FetchData";
import {toast} from "react-toastify";

const PostPageStats = (props: {post: IPost}) => {

    const strings = new LocalizedStrings({
        en:{
            stats:"Stats",
            likes:'people like this',
            comments:'comments',
            share:'Share',
            error: "Error. Try again later"
        },
        ua: {
            stats:"Статистика",
            likes:'людям сподобалось',
            comments:'коментарів',
            share:'Поділитись',
            error:"Сталася помилка. Спробуйте пізніше"
        }
    })
    const [isLike, setIsLike] = useState(props.post.isLike)
    const [likeCount, setLikeCount] = useState(props.post.likesCount)

    console.log(likeCount)
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
        <div className='post-page-stats-wrapper'>
            <label className={'post-page-label'}>{strings.stats}</label>
            <div className='post-page-stats'>
                <div onClick={likeHandle} className='post-page-stat'>
                    {isLike ?
                    <FontAwesomeIcon className={'heart-fill'} icon={solid('heart')}/>
                    :
                    <FontAwesomeIcon className={'post-page-icon-stat'} icon={solid('heart')}/>}
                    <div>
                        {likeCount} {strings.likes}
                    </div>
                </div>

                <div className='post-page-stat'>
                    <FontAwesomeIcon className={'post-page-icon-stat'} icon={solid('message')}/>
                    <div>
                        {props.post.commentsCount} {strings.comments}
                    </div>
                </div>

                <div className='post-page-stat'>
                    <FontAwesomeIcon className={'post-page-icon-stat'} icon={solid('paper-plane')}/>
                    <div>
                         {strings.share}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPageStats;