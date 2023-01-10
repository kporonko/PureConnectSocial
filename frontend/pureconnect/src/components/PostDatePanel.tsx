import React from 'react';
import {IPost} from "../interfaces/IPost";
import {getUsersLocale} from "../functions/getUsersLocale";
import {getDate, getTime} from "../functions/dateFunctions";

const PostDatePanel = (props: {post: IPost}) => {

    return (
        <div className='post-date-wrapper'>
            <div className='post-date-date'>
                {getDate(props.post.createdAt)}
            </div>

            <div className='post-date-time'>
                {getTime(props.post.createdAt)}
            </div>
        </div>
    );
};

export default PostDatePanel;