import React from 'react';
import AdminContentHome from '../components/AdminContentHome';
import AdminNav, {AdminPage} from "../components/AdminNav";
import {ToastContainer} from "react-toastify";

const AdminHome = (props: {theme: string, setTheme: any}) => {
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.Home}/>
            <AdminContentHome theme={props.theme}/>
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

export default AdminHome;