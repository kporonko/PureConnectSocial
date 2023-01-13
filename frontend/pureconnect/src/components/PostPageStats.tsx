import React from 'react';
import {IPost} from "../interfaces/IPost";
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

const PostPageStats = (props: {post: IPost}) => {

    const strings = new LocalizedStrings({
        en:{
            stats:"Stats",
            likes:'people like this',
            comments:'comments',
            share:'Share',
        },
        ua: {
            stats:"Статистика",
            likes:'людям сподобалось',
            comments:'коментарів',
            share:'Поділитись',
        }
    })

    return (
        <div className='post-page-stats-wrapper'>
            <label className={'post-page-label'}>{strings.stats}</label>
            <div className='post-page-stats'>
                <div className='post-page-stat'>
                    {props.post.isLike ?
                    <FontAwesomeIcon className={'heart-fill'} icon={solid('heart')}/>
                    :
                    <FontAwesomeIcon className={'post-page-icon-stat'} icon={solid('heart')}/>}
                    <div>
                        {props.post.likesCount} {strings.likes}
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