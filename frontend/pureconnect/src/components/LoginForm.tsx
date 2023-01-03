import React, {FormEvent, useState} from 'react';
import {Link} from "react-router-dom";
import {login} from "../utils/FetchData";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ILoginResponseOk} from "../interfaces/ILoginResponseOk";
import {ILoginResponseBad} from "../interfaces/ILoginResponseBad";

const LoginForm = (props: {theme: string}) => {

    let strings = new LocalizedStrings({
        en:{
            loginText:"Login to Pure Connect",
            loginInp:"Email",
            passInp:"Password",
            forgotPass:"Forgot password",
            dontHaveAcc:"Don`t have an account",
            logBtn:"Log In",
            loginErrorValid:"Entered data was invalid. Try again.",
        },
        ua: {
            loginText:"Вхід до Pure Connect",
            loginInp:"Електронна пошта",
            passInp:"Пароль",
            forgotPass:"Забули пароль",
            dontHaveAcc:"В мене немає акаунта",
            logBtn:"Увійти",
            loginErrorValid:"Введені дані були невірними. Спробуйте ще раз.",

        }
    });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const nav = useNavigate();

    const loginUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await login({email: email, password: password});
        if(res.status === 400){
            const notify = () => toast.error(strings.loginErrorValid);
            notify();
        }
        else if ((res as ILoginResponseOk).token?.length > 0 && (res as ILoginResponseOk).role?.length > 0){
            handleNav(res!.role, res!.token);
        }
        else{
            const text = (res as ILoginResponseBad).value
            const notify = () => toast.error(text);
            notify();
        }
    }

    const handleNav = (role: string|null, token: string|null) => {
        if (role === null || token === null){
            const notify = () => toast.error(strings.loginErrorValid);
            notify();
            return;
        }

        if (role === "admin")
            nav("/admin-home")
        else if (role === "user")
            nav("/home")
    }

    const isEmail = (email:string) => {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        return regexExp.test(email);
    }
    return (
        <div className="login-form-wrapper">

            <form onSubmit={(e) => loginUser(e)}>
                <div className="login-form-text">
                    {strings.loginText}
                </div>

                <div>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='login-form-input'
                        placeholder={strings.loginInp}
                        type="email"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='login-form-input'
                        placeholder={strings.passInp}
                        type="password"
                    />
                </div>

                <div className='login-form-additional-func'>
                    <Link className='login-form-links' to={'soon'}>
                        {strings.forgotPass}
                    </Link>
                    <Link className='login-form-links' to={'register'}>
                        {strings.dontHaveAcc}
                    </Link>
                </div>

                <div className='login-form-buttons-wrapper'>
                    <div className={isEmail(email) && password.length > 0 ? 'login-form-button-div active-button-div' : 'login-form-button-div'}>
                        <button type={'submit'} disabled={!isEmail(email) || password.length < 1} className={isEmail(email) && password.length > 0 ? 'login-form-button active-button' : 'login-form-button'}>
                            {strings.logBtn}
                        </button>
                    </div>

                    <div id="signInDiv">

                    </div>
                </div>
            </form>

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

export default LoginForm;