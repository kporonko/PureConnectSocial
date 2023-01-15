import React, {SetStateAction} from 'react';
import {IPost} from "../interfaces/IPost";
import ModalAddPostTopPanel from "./ModalAddPostTopPanel";
import ModalAddEditPostContent from "./ModalAddEditPostContent";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import ModalEditPostTopPanel from "./ModalEditPostTopPanel";

const ModalEditPost = (props: {
    post: IPostAddRequest|undefined,
    setPost: React.Dispatch<SetStateAction<IPostAddRequest>>,
    isChangedPosts: boolean|undefined,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>|undefined,
    theme: string,
    isActiveEditPost: boolean,
    setIsActiveEditPost: React.Dispatch<SetStateAction<boolean>>
}) => {
    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsActiveEditPost(false)
    }
    return (
        <div onClick={closeModal} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-add-post-content-with-panel">
                <ModalEditPostTopPanel theme={props.theme} isChangedPosts={props.isChangedPosts} setIsChangedPosts={props.setIsChangedPosts}/>
                {props.post && <ModalAddEditPostContent isEdit={true} theme={props.theme} post={props.post} setPost={props.setPost}/>}
            </div>
        </div>
    );
};

export default ModalEditPost;