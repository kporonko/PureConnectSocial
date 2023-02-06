import React from 'react';
import AdminNav, {AdminPage} from "../components/AdminNav";
import AdminContentPostReports from "../components/AdminContentPostReports";

const AdminPostReports = (props:
  {
        theme: string,
        setTheme: any
  }) => {
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.PostReports}/>
            <AdminContentPostReports/>
        </div>
    );
};

export default AdminPostReports;