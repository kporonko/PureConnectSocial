import React, {SetStateAction} from 'react';
import {ToastContainer} from "react-toastify";
import LocalizedStrings from "react-localization";

const ModalEditPostTopPanel = (props: {
    isChangedPosts: boolean|undefined,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>|undefined,
    theme: string
}) => {

    const strings = new LocalizedStrings({
        en:{
            cancel: "Cancel",
            edit: "Edit Post",
            save: "Save",
        },
        ua: {
            cancel: "Відмінити",
            edit: "Редагувати пост",
            save: "Зберегти",
        }
    })

    return (
        <div>
            <div className='modal-add-post-top-panel-wrapper'>
                <div className="modal-add-post-top-panel-text">
                    {strings.cancel}
                </div>
                <div className="modal-add-post-top-panel-header">
                    {strings.edit}
                </div>
                <div className="modal-add-post-top-panel-text">
                    {strings.save}
                </div>
            </div>
            <ToastContainer
                className={`toast-container`}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={props.theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default ModalEditPostTopPanel;