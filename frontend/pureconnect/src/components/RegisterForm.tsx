import React, {ChangeEvent, useRef, useState} from 'react';
import LocalizedStrings from "react-localization";
import {isEmail} from "../functions/stringFunctions";
import { IRegisterUser } from '../interfaces/IRegisterUser';
import {Link} from "react-router-dom";

const RegisterForm = () => {
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

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            // Implement image to base64
            setUser({...user, avatar: e.target.value} as IRegisterUser)
            console.log(user?.avatar)
        }
    };

    return (
        <div className={'register-form'}>
            <h1 className={'register-header'}>
                {strings.registerText}
            </h1>
            <form>
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
                <div className={ isEmail(user.email) && user?.password.length > 0 && user.firstName.length > 0 && user.lastName.length > 0 && user.birthDate.length > 0 && user.username.length > 0? 'login-form-button-div active-button-div' : 'login-form-button-div'}>
                    <button type={'submit'} disabled={ !isEmail(user?.email) || user?.password.length < 1 || user.firstName.length < 1 || user.lastName.length < 1 || user.birthDate.length < 1 || user.username.length < 1} className={isEmail(user?.email) && user?.password.length > 0 ? 'login-form-button active-button' : 'login-form-button'}>
                        {strings.regBtn}
                    </button>
                </div>

                <div className={"button-already-have-acc"}>
                    <Link className={'link'} to={'/'}>
                        {strings.alrHaveAcc}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;