import React from 'react';
import {IPost} from "../interfaces/IPost";

const PostUser = (props: {post: IPost}) => {
    return (
        <div className={'post-user-wrapper'}>
            <div>
                <img className={'post-user-avatar'} src={props.post.avatar} alt="Avatar"/>
            </div>

            <div>
                <div className={'post-user-name'}>
                    {props.post.fullName}
                </div>
                <div className={'post-user-username'}>
                    @{props.post.username}
                </div>
            </div>
        </div>
    );
};

export default PostUser;