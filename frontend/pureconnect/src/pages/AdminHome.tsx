import React from 'react';
import AdminContentHome from '../components/AdminContentHome';
import AdminNav, {AdminPage} from "../components/AdminNav";

const AdminHome = (props: {theme: string, setTheme: any}) => {
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.Home}/>
            <AdminContentHome theme={props.theme}/>
        </div>
    );
};

export default AdminHome;