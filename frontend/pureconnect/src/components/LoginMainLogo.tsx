import React from 'react';
import logoBlack from '../assets/pure connect icon black.png'
import logoWhite from '../assets/pure connect icon white.png'

const LoginMainLogo = (props: {theme: string}) => {
    return (
        <div className="login-main-logo-wrapper">
            <div className="login-main-logo-img-wrapper">
                <img className="login-main-logo-img" src={props.theme === 'dark' ? logoWhite: logoBlack} alt="Pure Connect"/>
            </div>

            <div className='login-main-logo-text'>
                &copy; 2023 Pure Connect. All rights reserved.
            </div>
        </div>
    );
};

export default LoginMainLogo;