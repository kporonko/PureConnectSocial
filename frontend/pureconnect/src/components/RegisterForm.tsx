import React, {useRef, useState} from 'react';
import LocalizedStrings from "react-localization";

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
            dontHaveAcc:"Don`t have an account",
            logBtn:"Log In",
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
            dontHaveAcc:"В мене немає акаунта",
            logBtn:"Увійти",
            loginErrorValid:"Введені дані були невірними. Спробуйте ще раз.",

        }
    });

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [birthDate, setBirthDate] = React.useState("");
    const [avatar, setAvatar] = React.useState("");

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

    const handleChange = () => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={'register-form'}>
            <h1 className={'register-header'}>
                {strings.registerText}
            </h1>
            <form>
                <div className='register-inputs-wrapper'>
                    <input
                        className={'login-form-input register-input-additional'}
                        type="email"
                        placeholder={strings.loginInp}
                        value={email}
                    />
                    <input
                        className={'login-form-input register-input-additional'}
                        type="password"
                        placeholder={strings.passInp}
                        value={password}
                    />
                </div>

                <div className='register-inputs-wrapper'>
                    <input
                        className={'login-form-input register-input-additional'}
                        type="text"
                        placeholder={strings.lastNameInp}
                        value={lastName}
                    />
                    <input
                        className={'login-form-input register-input-additional'}
                        type="text"
                        placeholder={strings.firstNameInp}
                        value={firstName}
                    />
                </div>

                <div className='register-inputs-wrapper'>
                    <input
                        className={'login-form-input register-input-additional'}
                        type="text"
                        placeholder={strings.locationInp}
                        value={location}
                    />
                    <input
                        className={'login-form-input register-input-additional'}
                        type="date"
                        placeholder={strings.birthDateInp}
                        value={birthDate}
                    />

                </div>
                <div className={'register-single-input-wrapper'}>
                    <div>
                        <input
                            style={{width : '17vw'}}
                            className={'register-form-input'}
                            type="text"
                            placeholder={strings.usernameInp}
                            value={username}
                        />
                    </div>
                </div>
                <div className={'register-absolute'}>
                    <input type="file" ref={fileInput} accept="image/*" onChange={handleChange} />
                    <br />
                    <img className="register-form-avatar-image" src={preview?.toString()} alt="Preview" />
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;