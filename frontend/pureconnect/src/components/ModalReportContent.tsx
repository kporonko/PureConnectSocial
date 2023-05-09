import React from 'react';
import LocalizedStrings from "react-localization";

const ModalReportContent = (props:{
    reportText: string,
    setReportText: React.Dispatch<React.SetStateAction<string>>
}) => {
    const strings = new LocalizedStrings({
        en:{
            placeholder: "Write your report here...",
        },
        ua: {
            placeholder: "Напишіть вашу скаргу тут...",
        }
    })

    return (
        <div>
            <textarea onChange={(e) => props.setReportText(e.target.value)} value={props.reportText} className='modal-report-input' placeholder={strings.placeholder}/>
        </div>
    );
};

export default ModalReportContent;