import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {useNavigate} from "react-router";

interface ModalHomeNavMenuMoreProps {
    isOpen: boolean;
    theme: string;
    setTheme: any;
}

const ModalHomeNavMenuMore : React.FC<ModalHomeNavMenuMoreProps> = ({isOpen, theme, setTheme}) => {

    const nav = useNavigate();

    const handleChangeTheme = () => {
        console.log(theme);
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const handleReport = () => {
    //    Add modal window of report message.
    }

    const handleExit = () => {
        localStorage.removeItem('access_token');
        nav('/');
    }

    return (
        isOpen ? (
            <div className="modal-home-nav-manu-more-wrapper">
                <div className="modal-home-nav-menu-more-items">
                    <div onClick={() => nav('/settings')} className="modal-home-nav-menu-more-item-first">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Settings
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('gear')}/>
                        </div>
                    </div>
                    <div onClick={handleChangeTheme} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Change Theme
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            {theme === 'light' ?
                                <FontAwesomeIcon icon={solid('moon')}/> :
                                <FontAwesomeIcon icon={solid('sun')}/>
                            }
                        </div>
                    </div>

                    <div onClick={handleReport} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Report
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('circle-exclamation')}/>
                        </div>
                    </div>

                    <div onClick={handleExit} className="modal-home-nav-menu-more-item-last">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Exit
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('right-from-bracket')}/>
                        </div>
                    </div>
                </div>
            </div>
        ) : <div></div>
    );
};

export default ModalHomeNavMenuMore;