import React, {useEffect} from 'react';
import {IReport} from "../interfaces/IReport";
import Loader from "./Loader";
import ReportCard from "./ReportCard";
import {GetReports} from "../utils/FetchData";

const AdminContentHome = (props:{
    theme: string,
}) => {


    const [reports, setReports] = React.useState<IReport[]>();

    useEffect(() => {
        const getReports = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await GetReports(token);
                const data = await response.json();
                setReports(data);
            }
        }
        getReports();
    }, [])

    return (
        <div className='admin-content-wrapper'>
            {reports === undefined ?
                <Loader theme={props.theme}/>
                :
                reports.length === 0 ?
                <div>
                    <h1>No Reports</h1>
                </div>
                    :
                <div>
                    {reports.map((report, index) => (
                        <ReportCard report={report} key={index}/>
                    ))}
                </div>
            }
        </div>
    );
};

export default AdminContentHome;