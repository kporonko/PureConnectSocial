import React, {useEffect} from 'react';
import AdminNav, {AdminPage} from "../components/AdminNav";
import {toast, ToastContainer} from "react-toastify";
import {IPostReport} from "../interfaces/IPostReport";
import LocalizedStrings from "react-localization";
import {DeletePostReport, GetPostReport, GetReport} from "../utils/FetchData";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {confirmAlert} from "react-confirm-alert";

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
            areSure: "Are you sure?",
            yes: "Yes",
            no: "No",
        },
        ua: {
            postReport: "Скарга на пост",
            deletePostReport: "Видалити скаргу на пост",
            goToPost: "Перейти до посту",
            areSure: "Ви впевнені?",
            yes: "Так",
            no: "Ні",
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


    const handleDelete = async () => {
        confirmAlert({
            message: strings.areSure,
            title: 'Confirm To Delete Post',
            buttons:[
                {
                    label: strings.yes,
                    onClick: deleteReport

                },
                {
                    label: strings.no,
                }
            ]
        })
    }

    const deleteReport = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const response = await DeletePostReport(token, +postReportId!);
            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error("Your session is expired. Please log in again.");
                notify();
            }
            else if (response.status === 200){
                const notify = () => toast.success("Report was deleted.");
                notify();
                setTimeout(() => nav('/admin-post-reports'), 2000);
            }
            else{
                const notify = () => toast.error("Something went wrong.");
                notify();
            }
        }
    }

    const handleGoToPost = () => {
        nav(`/admin-post/${postReport?.postId}`);
    }

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
                            <div onClick={handleDelete} className='delete-report-button-wrapper'>
                                <div className="delete-report-button">
                                    {strings.deletePostReport}
                                </div>
                            </div>
                            <div onClick={handleGoToPost} className='go-to-post-page-button-wrapper'>
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