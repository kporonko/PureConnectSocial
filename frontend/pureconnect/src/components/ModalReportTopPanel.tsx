import React from 'react';
import LocalizedStrings from "react-localization";
import {AddReport, editPost} from "../utils/FetchData";
import {IPostPutRequest} from "../interfaces/IPostPutRequest";
import {toast, ToastContainer} from "react-toastify";

const ModalReportTopPanel = (props:{
    setIsModalReportOpen: React.Dispatch<React.SetStateAction<boolean>>,
    reportText: string
}) => {

    const strings = new LocalizedStrings({
        en:{
            cancel: "Cancel",
            report: "Report",
            send: "Send",
            sent: "Report is successfully sent",
            error: "Error. Try again later",
        },
        ua: {
            cancel: "Відмінити",
            report: "Поскаржитися",
            send: "Надіслати",
            sent: "Скарга успішно надіслана",
            error: "Сталася помилка. Спробуйте пізніше",
        }
    })

    const handleClose = () => {
        props.setIsModalReportOpen(false)
    }

    const handleSendReport = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const res = await AddReport(token, props.reportText);
            if (res.status === 200) {
                props.setIsModalReportOpen!(false)
                const notify = () => toast.success(strings.sent);
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
                    {strings.report}
                </div>
                <div onClick={handleSendReport} className="modal-add-post-top-panel-text">
                    {strings.send}
                </div>
            </div>
        </div>
    );
};

export default ModalReportTopPanel;