import React from 'react';
import {IPostImage} from "../interfaces/IPostImage";
import {useNavigate} from "react-router";

const PostImage = (props: {postImage: IPostImage|undefined}) => {

    const nav = useNavigate();

    return (
        <div onClick={() => nav(`/post/${props.postImage?.postId}`)} className={'posts-images-wrapper'}>
            <img className={'post-image-image'} src={props.postImage?.image} alt=""/>
        </div>
    );
};

export default PostImage;