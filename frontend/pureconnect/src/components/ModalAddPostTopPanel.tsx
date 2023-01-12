import React from 'react';
import LocalizedStrings from "react-localization";

const ModalAddPostTopPanel = () => {
    let strings = new LocalizedStrings({
        en:{
            cancel:"Cancel",
            add:"Add Post",
            post:"Post",
        },
        ua: {
            cancel: "Скасувати",
            add: "Додати пост",
            post: "Викласти",
        }
    });

    return (
        <div className='modal-add-post-top-panel-wrapper'>
            <div className="modal-add-post-top-panel-text">
                {strings.cancel}
            </div>
            <div className="modal-add-post-top-panel-header">
                {strings.add}
            </div>
            <div className="modal-add-post-top-panel-text">
                {strings.post}
            </div>
        </div>
    );
};

export default ModalAddPostTopPanel;