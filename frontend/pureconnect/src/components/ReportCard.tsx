import React from 'react';
import {IReport} from "../interfaces/IReport";
import {useNavigate} from "react-router";

const ReportCard = (props:{
    report: IReport
}) => {
    const nav = useNavigate()
    return (
        <div className='report-card-wrapper'>
            <div onClick={() => nav(`/report/${props.report.id}`)} className='report-card-content'>
                <div className='report-card-text'>
                    {props.report.text}
                </div>

                <div className='report-card-date'>
                    {new Date(props.report.createdAt?.toString()).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default ReportCard;