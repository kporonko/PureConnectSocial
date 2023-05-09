import React, {SetStateAction} from 'react';
import {toast, ToastContainer} from "react-toastify";
import LocalizedStrings from "react-localization";
import {editPost} from "../utils/FetchData";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import {IPostPutRequest} from "../interfaces/IPostPutRequest";

const ModalEditPostTopPanel = (props: {
    isChangedPosts: boolean|undefined,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>|undefined,
    theme: string,
    setIsActiveEditPost: React.Dispatch<SetStateAction<boolean>>,
    post: IPostAddRequest|undefined,
}) => {

    const strings = new LocalizedStrings({
        en:{
            cancel: "Cancel",
            edit: "Edit Post",
            save: "Save",
            saved: "Post is successfully edited",
            error: "Error. Try again later",
        },
        ua: {
            cancel: "Відмінити",
            edit: "Редагувати пост",
            save: "Зберегти",
            saved: "Пост успішно змінено",
            error: "Сталася помилка. Спробуйте пізніше",
        }
    })

    const handleClose = () => {
        props.setIsActiveEditPost!(false)
    }

    const handleSaveChanges = async () => {
        console.log("SAVE CHANGES")
        const token = localStorage.getItem('access_token')
        const encodedDescription = encodeURIComponent(props.post!.description);

        if (token) {
            const res = await editPost(token, {postId: props.post!.postId, description: encodedDescription} as IPostPutRequest);
            if (res.status === 200) {
                if (props.setIsChangedPosts)
                    props.setIsChangedPosts(!props.isChangedPosts!)
                props.setIsActiveEditPost!(false)
                const notify = () => toast.success(strings.saved);
                notify();
            }
            else {
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

    return (
        <div>
            <div className='modal-add-post-top-panel-wrapper'>
                <div onClick={handleClose} className="modal-add-post-top-panel-text">
                    {strings.cancel}
                </div>
                <div className="modal-add-post-top-panel-header">
                    {strings.edit}
                </div>
                <div onClick={handleSaveChanges} className="modal-add-post-top-panel-text">
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