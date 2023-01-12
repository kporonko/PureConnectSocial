import React, {SetStateAction, useState} from 'react';
import ModalAddPostTopPanel from "./ModalAddPostTopPanel";
import ModalAddPostContent from "./ModalAddPostContent";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

const ModalAddPost = (props: {theme: string,isActiveAddPost: boolean, setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>}) => {

    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsActiveAddPost(false)
    }
    const [post, setPost] = useState<IPostAddRequest>({ image: "", description: "", createdAt: undefined});


    return (
        <div onClick={(e) => closeModal(e)} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-add-post-content-with-panel">
                <ModalAddPostTopPanel theme={props.theme} setIsActiveAddPostModal={props.setIsActiveAddPost} post={post}/>
                <ModalAddPostContent post={post} setPost={setPost}/>
            </div>
        </div>
    );
};

export default ModalAddPost;