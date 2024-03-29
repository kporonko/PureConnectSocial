import React, {SetStateAction, useState} from 'react';
import ModalAddPostTopPanel from "./ModalAddPostTopPanel";
import ModalAddEditPostContent from "./ModalAddEditPostContent";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import {IPost} from "../interfaces/IPost";
import {IPostImage} from "../interfaces/IPostImage";

const ModalAddPost = (props: {
    setPosts: React.Dispatch<SetStateAction<IPost[]|undefined>>,
    setImages: React.Dispatch<SetStateAction<IPostImage[]|undefined>>,
    theme: string,
    isActiveAddPost: boolean,
    setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>,
    posts: IPost[]|undefined,
    postsImage: IPostImage[]|undefined,
    isChangedPosts: boolean,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>
}) => {

    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsActiveAddPost(false)
    }
    const [post, setPost] = useState<IPostAddRequest>({ image: "", description: "", createdAt: undefined, postId: undefined});


    return (
        <div onClick={(e) => closeModal(e)} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-add-post-content-with-panel">
                <ModalAddPostTopPanel setIsChangedPosts={props.setIsChangedPosts} isChangedPosts={props.isChangedPosts} posts={props.posts} postsImage={props.postsImage} setPosts={props.setPosts} setImages={props.setImages} theme={props.theme} setIsActiveAddPostModal={props.setIsActiveAddPost} post={post}/>
                <ModalAddEditPostContent isEdit={false} theme={props.theme} post={post} setPost={setPost}/>
            </div>
        </div>
    );
};

export default ModalAddPost;