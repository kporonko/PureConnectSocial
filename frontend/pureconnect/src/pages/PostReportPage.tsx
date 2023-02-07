import React, {useEffect} from 'react';
import AdminNav, {AdminPage} from "../components/AdminNav";
import {toast, ToastContainer} from "react-toastify";
import {IPostReport} from "../interfaces/IPostReport";
import LocalizedStrings from "react-localization";
import {GetPostReport, GetReport} from "../utils/FetchData";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";

const PostReportPage = (props: {
    theme: string,
    setTheme: any
}) => {

    const [postReport, setPostReport] = React.useState<IPostReport>();

    const strings = new LocalizedStrings({
        en:{
            postReport: "Post Report",
            deletePostReport: "Delete Post Report",
            goToPost: "Go to post",
        },
        ua: {
            postReport: "Скарга на пост",
            deletePostReport: "Видалити скаргу на пост",
            goToPost: "Перейти до посту",
        }
    })

    const {postReportId} = useParams()

    const nav = useNavigate();

    useEffect(() => {
        const getReport = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await GetPostReport(token, +postReportId!);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error("Your session is expired. Please log in again.");
                    notify();
                }
                else if (response.status === 200){
                    const data = await response.json();
                    setPostReport(data);
                }
                else{
                    const notify = () => toast.error("Something went wrong.");
                    notify();
                }
            }
        }

        getReport();
    }, [postReportId])


    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.Post}/>

            {postReport === undefined ? '' :
                <div className={'admin-content-wrapper center'}>
                    <div className='report'>
                        <div className='post-report-header'>
                            <h1>{strings.postReport} №{postReport.id}</h1>
                        </div>
                        <div className='post-report-buttons-wrapper'>
                            <div className='delete-report-button-wrapper'>
                                <div className="delete-report-button">
                                    {strings.deletePostReport}
                                </div>
                            </div>
                            <div className='go-to-post-page-button-wrapper'>
                                <div className="go-to-post-page-button">
                                    {strings.goToPost}
                                </div>
                            </div>
                        </div>

                        <div className='report-wrapper'>
                            <div className='report-text'>
                                {postReport?.text}
                            </div>
                            <div>
                                {new Date(postReport.createdAt?.toString()).toLocaleDateString()}
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

export default PostReportPage;