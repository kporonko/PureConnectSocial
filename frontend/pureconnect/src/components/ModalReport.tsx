import React from 'react';
import MyProfileInfo from "./MyProfileInfo";
import ModalReportTopPanel from "./ModalReportTopPanel";
import ModalReportContent from "./ModalReportContent";

const ModalReport = (props: {
    isModalReportOpen: boolean,
    setIsModalReportOpen: React.Dispatch<React.SetStateAction<boolean>>,
    postId?: number,
    isPost: boolean,
}) => {
    const closeModal = () => {
        props.setIsModalReportOpen(false)
    }
    const [reportText, setReportText] = React.useState<string>("")
    return (
        <div onClick={closeModal} className={'modal-report-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className={'modal-report-content'}>
                <ModalReportTopPanel postId={props.postId} isPost={props.isPost} reportText={reportText} setIsModalReportOpen={props.setIsModalReportOpen}/>
                <ModalReportContent reportText={reportText} setReportText={setReportText}/>
            </div>
        </div>
    );
};

export default ModalReport;