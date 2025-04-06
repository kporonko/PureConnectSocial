import React, { SetStateAction } from 'react';
import { toast, ToastContainer } from "react-toastify";
import LocalizedStrings from "react-localization";
import { IPostImage } from "../interfaces/IPostImage";

interface ModalRecommendedPostTopPanelProps {
    post: IPostImage | undefined;
    setIsActivePostModal: React.Dispatch<SetStateAction<boolean>>;
    theme: string;
}

const ModalRecommendedPostTopPanel: React.FC<ModalRecommendedPostTopPanelProps> = (props) => {
    const strings = new LocalizedStrings({
        en: {
            close: "Close",
            postDetails: "Post Details",
            viewPost: "View Full Post",
        },
        ua: {
            close: "Закрити",
            postDetails: "Деталі посту",
            viewPost: "Переглянути повний пост",
        }
    });

    const handleClose = () => {
        props.setIsActivePostModal(false);
    }

    return (
        <div>
            <div className='modal-add-post-top-panel-wrapper'>
                <div onClick={handleClose} className="modal-add-post-top-panel-text">
                    {strings.close}
                </div>
                <div className="modal-add-post-top-panel-header">
                    {strings.postDetails}
                </div>
                <div onClick={handleClose} className="modal-add-post-top-panel-text">
                    {strings.close}
                </div>
            </div>
        </div>
    );
};

export default ModalRecommendedPostTopPanel;