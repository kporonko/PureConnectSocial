import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";

interface ModalHomeNavMenuMoreProps {
    isOpen: boolean;
    theme: string;
    setTheme: any;
}

const ModalHomeNavMenuMore : React.FC<ModalHomeNavMenuMoreProps> = ({isOpen, theme, setTheme}) => {
    let strings = new LocalizedStrings({
        en:{
            settings:"Settings",
            changeTheme:"Change Theme",
            report:"Report",
            exit:"Exit"
        },
        ua: {
            settings:"Налаштування",
            changeTheme:"Змінити тему",
            report:"Повідомити про проблему",
            exit:"Вийти"
        }
    });
    const nav = useNavigate();

    const handleChangeTheme = () => {
        console.log(theme);
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const handleReport = () => {
    //    Add modal window of report message.
    }

    const handleExit = () => {
        nav('/');
        localStorage.removeItem('access_token');
    }

    return (
        isOpen ? (
            <div className="modal-home-nav-manu-more-wrapper">
                <div className="modal-home-nav-menu-more-items">
                    <div onClick={() => nav('/settings')} className="modal-home-nav-menu-more-item-first">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.settings}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('gear')}/>
                        </div>
                    </div>
                    <div onClick={handleChangeTheme} className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.changeTheme}
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
                            {strings.report}
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('circle-exclamation')}/>
                        </div>
                    </div>

                    <div onClick={handleExit} className="modal-home-nav-menu-more-item-last">
                        <div className='modal-home-nav-menu-more-item-text'>
                            {strings.exit}
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