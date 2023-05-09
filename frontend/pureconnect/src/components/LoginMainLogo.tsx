import React from 'react';
import LocalizedStrings from 'react-localization';
import logoBlack from '../assets/pure connect icon black.png'
import logoWhite from '../assets/pure connect icon white.png'

const LoginMainLogo = (props: {theme: string}) => {

    let strings = new LocalizedStrings({
        en:{
            rights:"All rights reserved.",

        },
        ua: {
            rights:"Всі права захищені.",
        }
    });

    return (
        <div className="login-main-logo-wrapper">
            <img className="login-main-logo-img" src={props.theme === 'dark' ? logoWhite: logoBlack} alt="Pure Connect"/>

            <div className='login-main-logo-text'>
                &copy; 2023 Pure Connect. {strings.rights}
            </div>
        </div>
    );
};

export default LoginMainLogo;