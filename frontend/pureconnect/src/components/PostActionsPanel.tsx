import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {regular, solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";
import {IPost} from "../interfaces/IPost";

const PostActionsPanel = (props: {post: IPost}) => {

    let strings = new LocalizedStrings({
        en:{
            likeCount: 'people like it',
            commentCount: 'comments'
        },
        ua: {
            likeCount: 'людям подобається',
            commentCount: 'коментарів'
        }
    });

    return (
        <div className={'post-actions-wrapper'}>
            <div className={'post-action'}>
                <div className='post-action-icon'>
                    {props.post.isLike ?
                        <FontAwesomeIcon className={'heart-fill'} icon={solid('heart')}/> :
                        <FontAwesomeIcon icon={regular('heart')}/>
                    }
                </div>

                <div className='post-action-desc'>
                    {props.post.likesCount} {strings.likeCount}
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
        </div>
    );
};

export default PostActionsPanel;