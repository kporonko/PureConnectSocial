import React from 'react';
import {IPostImage} from "../interfaces/IPostImage";

const PostImage = (props: {postImage: IPostImage|undefined}) => {
    return (
        <div className={'posts-images-wrapper'}>
            <img className={'post-image-image'} src={props.postImage?.image} alt=""/>
        </div>
    );
};

export default PostImage;