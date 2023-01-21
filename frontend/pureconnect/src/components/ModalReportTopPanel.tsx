import React from 'react';
import LocalizedStrings from "react-localization";
import {editPost} from "../utils/FetchData";
import {IPostPutRequest} from "../interfaces/IPostPutRequest";
import {toast, ToastContainer} from "react-toastify";

const ModalReportTopPanel = (props:{
    setIsModalReportOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    const strings = new LocalizedStrings({
        en:{
            cancel: "Cancel",
            report: "Report",
            send: "Send",
        },
        ua: {
            cancel: "Відмінити",
            report: "Поскаржитися",
            send: "Надіслати",
        }
    })

    const handleClose = () => {
        props.setIsModalReportOpen(false)
    }

    return (
        <div>
            <div className='modal-add-post-top-panel-wrapper'>
                <div onClick={handleClose} className="modal-add-post-top-panel-text">
                    {strings.cancel}
                </div>
                <div className="modal-add-post-top-panel-header">
                    {strings.report}
                </div>
                <div className="modal-add-post-top-panel-text">
                    {strings.send}
                </div>
            </div>
        </div>
    );
};

export default ModalReportTopPanel;