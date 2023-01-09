import React from 'react';
import {IPost} from "../interfaces/IPost";
import {getUsersLocale} from "../functions/getUsersLocale";

const PostDatePanel = (props: {post: IPost}) => {

    const getDate = (date: Date) => {
        const localizedDateString = new Date(date)
        let res: string;
        if (localizedDateString.getFullYear() === new Date().getFullYear())
            res = localizedDateString.toLocaleDateString(getUsersLocale(), { month: 'long', day: 'numeric' });
        else
            res = localizedDateString.toLocaleDateString(getUsersLocale(), { year: 'numeric', month: 'long', day: 'numeric' });

        return `${res}`
    }

    const getTime = (date: Date) => {
        const localizedDateString = new Date(date)
        let res = localizedDateString.toLocaleTimeString(getUsersLocale(), { hour: '2-digit', minute: 'numeric' });
        return `${res}`
    }

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