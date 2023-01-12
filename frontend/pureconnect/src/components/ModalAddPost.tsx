import React, {SetStateAction} from 'react';
import ModalAddPostTopPanel from "./ModalAddPostTopPanel";
import ModalAddPostContent from "./ModalAddPostContent";

const ModalAddPost = (props: {isActiveAddPost: boolean, setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>}) => {

    const closeModal = (e:any) => {
        e.stopPropagation()
        props.setIsActiveAddPost(false)
    }


    return (
        <div onClick={(e) => closeModal(e)} className={'modal-add-post-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-add-post-content-with-panel">
                <ModalAddPostTopPanel/>
                <ModalAddPostContent/>
            </div>
        </div>
    );
};

export default ModalAddPost;