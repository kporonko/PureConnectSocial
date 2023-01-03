import React from 'react';
import ChangeThemeButton from "../components/ChangeThemeButton";
import RegisterForm from "../components/RegisterForm";

const Register = (props:{theme: string, setTheme: any}) => {
    return (
        <div className={'register-wrapper'} data-theme={props.theme}>
            <ChangeThemeButton theme={props.theme} setTheme={props.setTheme}/>
            <div className="register-form-wrapper">
                <RegisterForm/>
            </div>
        </div>
    );
};

export default Register;