import React from 'react';
import {useParams} from "react-router-dom";

const ReportPage = (props:{
    theme: string,
    setTheme: any
}) => {
    const {reportId} = useParams();
    return (
        <div>

        </div>
    );
};

export default ReportPage;