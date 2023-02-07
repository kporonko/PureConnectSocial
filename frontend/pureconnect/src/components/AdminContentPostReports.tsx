import React, {useEffect} from 'react';
import Loader from "./Loader";
import ReportCard from "./ReportCard";
import {IReport} from "../interfaces/IReport";
import {useNavigate} from "react-router";
import {GetPostReports, GetReports} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IPostReport} from "../interfaces/IPostReport";
import PostReportCard from "./PostReportCard";

const AdminContentPostReports = (props:{
    theme: string,
}) => {


    const [postReports, setPostReports] = React.useState<IPostReport[]>();
    const nav = useNavigate()
    useEffect(() => {
        const getReports = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await GetPostReports(token);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error("Your session is expired. Please log in again.");
                    notify();
                }
                else if (response.status === 200){
                    const data = await response.json();
                    setPostReports(data);
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
            {postReports === undefined ?
                <Loader theme={props.theme}/>
                :
                postReports.length === 0 ?
                    <div>
                        <h1>No Reports</h1>
                    </div>
                    :
                    <div>
                        {postReports.map((report, index) => (
                            <PostReportCard report={report} key={index}/>
                        ))}
                    </div>
            }
        </div>
    );
};

export default AdminContentPostReports;