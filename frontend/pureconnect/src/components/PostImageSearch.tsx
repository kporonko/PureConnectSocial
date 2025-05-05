import React, {SetStateAction} from 'react';
import {IPostImage} from "../interfaces/IPostImage";
import {useNavigate} from "react-router";
import postImage from "./PostImage";

const PostImageSearch = (props: {postImage: IPostImage|undefined, isActiveAddPost: boolean,
    setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>,
    chosenPostId: number|undefined,
    setChosenPostId: React.Dispatch<SetStateAction<number|undefined>>
}) => {

    const toggleModal = () => {
        if (!props.isActiveAddPost){
            props.setIsActiveAddPost(true)
        }
        else
            props.setIsActiveAddPost(false)

        props.setChosenPostId(props.postImage?.postId)
    }

    return (
        <div onClick={toggleModal} className={'posts-images-wrapper'}>
            <img className={'post-image-image'} src={props.postImage?.image} alt=""/>
        </div>
    );
};

export default PostImageSearch;