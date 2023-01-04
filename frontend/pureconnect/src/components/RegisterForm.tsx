import React, {ChangeEvent, FormEvent, useRef, useState} from 'react';
import LocalizedStrings from "react-localization";
import {isEmail} from "../functions/stringFunctions";
import { IRegisterUser } from '../interfaces/IRegisterUser';
import {Link} from "react-router-dom";
import {login, register} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {ILoginResponseOk} from "../interfaces/ILoginResponseOk";
import {useNavigate} from "react-router";

const RegisterForm = (props: {theme: string}) => {
    let strings = new LocalizedStrings({
        en:{
            registerText:"Create new account",
            loginInp:"Email",
            passInp:"Password",
            lastNameInp:"Last Name",
            firstNameInp:"First Name",
            usernameInp:"Username",
            locationInp:"Location (optional)",
            birthDateInp:"Date Of Birth",
            alrHaveAcc:"Already have an account",
            regBtn:"Create",
            loginErrorValid:"Entered data was invalid. Try again.",
        },
        ua: {
            registerText:"Створити новий акаунт",
            loginInp:"Електронна пошта",
            passInp:"Пароль",
            lastNameInp:"Прізвище",
            firstNameInp:"Ім'я",
            usernameInp:"Нікнейм",
            locationInp:"Місцезнаходження (не обов'язково)",
            birthDateInp:"Дата Народження",
            alrHaveAcc:"Маю акаунт",
            regBtn:"Створити",
            loginErrorValid:"Введені дані були невірними. Спробуйте ще раз.",

        }
    });

    const [user, setUser] = useState<IRegisterUser>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        username: '',
        location: '',
        birthDate: '',
        avatar: '',
    });

    const nav = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            // Implement image to base64
            convertAvatarImageToBase64(reader, file);
            console.log(user?.avatar)
        }
    };

    const convertAvatarImageToBase64 = (reader: FileReader, file: File) => {
        reader.onload = (event) => {
            console.log(event.target?.result as string)
            setUser({...user, avatar: event.target?.result as string});
        };
        reader.readAsDataURL(file);
    }

    const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await register(user)
        const responseJson = await res.json();

        if (res.status === 200) {
            const notify = () => toast.success(responseJson.value);
            notify();

            const res = await login({email: user.email, password: user.password});
            localStorage.setItem('access_token', res.token);
            setInterval(() => nav("/home"), 2000)
        }
        else if(res.status === 400) {
            const notify = () => toast.error(responseJson.errors);
            notify();
        }
        else if (res.status === 409) {
            const notify = () => toast.warning(responseJson.value);
            notify();
        }
    }

    const submitCheckForDisabled = () => {
        return !isEmail(user?.email) || user?.password.length < 1 || user.firstName.length < 1 || user.lastName.length < 1 || user.birthDate.length < 1 || user.username.length < 1
    }

    return (
        <div className={'register-form'}>
            <h1 className={'register-header'}>
                {strings.registerText}
            </h1>
            <form onSubmit={(e) => handleRegisterSubmit(e)}>
                <div className={'register-form-grid-wrapper'}>
                    <input
                        className={'login-form-input register-input-additional register-email-grid'}
                        type="email"
                        placeholder={strings.loginInp}
                        value={user?.email}
                        onChange={(e) => setUser({...user, email: e.target.value} as IRegisterUser)}
                    />
                    <input
                        className={'login-form-input register-input-additional register-password-grid'}
                        type="password"
                        placeholder={strings.passInp}
                        value={user?.password}
                        onChange={(e) => setUser({...user, password: e.target.value} as IRegisterUser)}
                    />

                    <input
                        className={'login-form-input register-input-additional register-last-name-grid'}
                        type="text"
                        placeholder={strings.lastNameInp}
                        value={user?.lastName}
                        onChange={(e) => setUser({...user, lastName: e.target.value} as IRegisterUser)}
                    />
                    <input
                        className={'login-form-input register-input-additional register-first-name-grid'}
                        type="text"
                        placeholder={strings.firstNameInp}
                        value={user?.firstName}
                        onChange={(e) => setUser({...user, firstName: e.target.value} as IRegisterUser)}
                    />

                    <input
                        className={'login-form-input register-input-additional register-location-grid'}
                        type="text"
                        placeholder={strings.locationInp}
                        value={user?.location}
                        onChange={(e) => setUser({...user, location: e.target.value} as IRegisterUser)}
                    />
                    <input
                        className={'login-form-input register-input-additional register-birth-date-grid'}
                        type="date"
                        placeholder={strings.birthDateInp}
                        value={user?.birthDate}
                        onChange={(e) => setUser({...user, birthDate: e.target.value} as IRegisterUser)}
                    />

                    <div className={"register-avatar"}>
                        <input
                            type="file"
                            ref={fileInput}
                            accept="image/*"
                            onChange={(e) => handleChange(e)}
                        />
                        <br />
                        <img className="register-form-avatar-image" src={preview?.toString()} alt="Preview" />
                    </div>

                    <input
                        className='login-form-input register-username-grid'
                        type="text"
                        placeholder={strings.usernameInp}
                        value={user?.username}
                        onChange={(e) => setUser({...user, username: e.target.value} as IRegisterUser)}
                    />

                </div>
                <div className={ isEmail(user.email) && user?.password.length >= 8 && user.firstName.length > 0 && user.lastName.length > 0 && user.birthDate.length > 0 && user.username.length > 0? 'login-form-button-div active-button-div' : 'login-form-button-div'}>
                    <button type={'submit'} disabled={submitCheckForDisabled()} className={ submitCheckForDisabled() ? 'login-form-button active-button' : 'login-form-button'}>
                        {strings.regBtn}
                    </button>
                </div>

                <div className={"button-already-have-acc"}>
                    <Link className={'link'} to={'/'}>
                        {strings.alrHaveAcc}
                    </Link>
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

export default RegisterForm;