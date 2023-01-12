import React, {SetStateAction} from 'react';
import LocalizedStrings from "react-localization";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import {addPost} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router";

const ModalAddPostTopPanel = (props: {theme: string,setIsActiveAddPostModal: React.Dispatch<SetStateAction<boolean>>, post: IPostAddRequest}) => {
    let strings = new LocalizedStrings({
        en:{
            cancel:"Cancel",
            add:"Add Post",
            post:"Post",
            success:'Post added successfully',
            error:'Error adding post',
            fillAllFields:'Please fill all fields',
            expired:"Your session is expired. Please log in again.",
        },
        ua: {
            cancel: "Скасувати",
            add: "Додати пост",
            post: "Викласти",
            success:'Пост успішно додано',
            error:'Помилка додавання поста',
            fillAllFields:'Будь ласка, заповніть всі поля',
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    });

    const nav = useNavigate();
    const handleAddPost = async () => {
        const token = localStorage.getItem('access_token');

        if (token === null){
            const notify = () => toast.error(strings.expired);
            notify();
            setTimeout(() => nav('/'), 2000);
        }

        if (props.post.image.length > 0 && props.post.description.length > 0) {
            const res = await addPost(token, props.post);
            console.log(res);
            if (res.status === 200) {
                const notify = () => toast.success(strings.success);
                notify();
                setTimeout(() => props.setIsActiveAddPostModal(false), 1000);
            }
            else{
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
        else{
            const notify = () => toast.warning(strings.fillAllFields);
            notify();
        }
    }

    return (
        <div>
            <div className='modal-add-post-top-panel-wrapper'>
                <div onClick={() => props.setIsActiveAddPostModal(false)} className="modal-add-post-top-panel-text">
                    {strings.cancel}
                </div>
                <div className="modal-add-post-top-panel-header">
                    {strings.add}
                </div>
                <div onClick={handleAddPost} className="modal-add-post-top-panel-text">
                    {strings.post}
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

export default ModalAddPostTopPanel;