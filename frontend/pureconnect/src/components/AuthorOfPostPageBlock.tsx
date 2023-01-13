import React from 'react';
import {IPost} from "../interfaces/IPost";
import LocalizedStrings from "react-localization";
import {getDate, getTime} from "../functions/dateFunctions";

const AuthorOfPostPageBlock = (props: {post: IPost}) => {

    const strings = new LocalizedStrings({
        en:{
            author:"Author",
        },
        ua: {
            author:"Автор",
        }
    })

    return (
        <div className='post-page-author-block-wrapper'>
            <label className={'post-page-label'}>{strings.author}</label>
            <div className={'post-page-author-block'}>
                <div className={'post-page-author-data'}>
                    <img className={'post-page-author-image'} src={props.post.avatar} alt=""/>
                    <div>
                        <div className={'post-user-name'}>{props.post.fullName}</div>
                        <div className={'post-user-username'}>@{props.post.username}</div>
                    </div>
                </div>
                <div className='post-page-date-time-wrapper'>
                    <div className={'post-page-date'}>
                        {getDate(props.post.createdAt)}
                    </div>
                    <div className={'post-page-time'}>
                        {getTime(props.post.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorOfPostPageBlock;