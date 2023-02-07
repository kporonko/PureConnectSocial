import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {IReport} from "../interfaces/IReport";
import {toast, ToastContainer} from "react-toastify";
import {GetReport} from "../utils/FetchData";
import {useNavigate} from "react-router";
import AdminNav, {AdminPage} from "../components/AdminNav";

const ReportPage = (props:{
    theme: string,
    setTheme: any
}) => {
    const {reportId} = useParams();

    const [report, setReport] = React.useState<IReport>();

    const nav = useNavigate();

    useEffect(() => {
        const getReport = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await GetReport(token, +reportId!);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error("Your session is expired. Please log in again.");
                    notify();
                }
                else if (response.status === 200){
                    const data = await response.json();
                    setReport(data);
                }
                else{
                    const notify = () => toast.error("Something went wrong.");
                    notify();
                }
            }
        }

        getReport();
    }, [reportId])
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.Post}/>
            {report === undefined ? '' :
            <div className={'admin-content-wrapper center'}>
                <div className='report'>
                    <div className='report-header'>
                        <h1>Report №{report.id}</h1>
                    </div>
                    <div className='report-wrapper'>
                        <div className='report-text'>
                            {report?.text}
                        </div>
                        <div>
                            {new Date(report.createdAt?.toString()).toLocaleDateString()}
                        </div>
                    </div>

                </div>

            </div>}
            <ToastContainer
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

export default ReportPage;