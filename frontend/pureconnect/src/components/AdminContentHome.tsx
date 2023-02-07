import React, {useEffect} from 'react';
import {IReport} from "../interfaces/IReport";
import Loader from "./Loader";
import ReportCard from "./ReportCard";
import {GetReports} from "../utils/FetchData";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";

const AdminContentHome = (props:{
    theme: string,
}) => {


    const [reports, setReports] = React.useState<IReport[]>();
    const nav = useNavigate()
    useEffect(() => {
        const getReports = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await GetReports(token);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error("Your session is expired. Please log in again.");
                    notify();
                }
                else if (response.status === 200){
                    const data = await response.json();
                    setReports(data);
                }
                else{
                    const notify = () => toast.error("Something went wrong.");
                    notify();
                }
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