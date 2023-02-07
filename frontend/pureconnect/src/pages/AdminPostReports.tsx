import React from 'react';
import AdminNav, {AdminPage} from "../components/AdminNav";
import AdminContentPostReports from "../components/AdminContentPostReports";
import {ToastContainer} from "react-toastify";

const AdminPostReports = (props:
  {
        theme: string,
        setTheme: any
  }) => {
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.PostReports}/>
            <AdminContentPostReports/>
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

export default AdminPostReports;