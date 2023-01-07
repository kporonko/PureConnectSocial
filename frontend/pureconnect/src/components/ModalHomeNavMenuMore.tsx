import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

interface ModalHomeNavMenuMoreProps {
    isOpen: boolean;
    theme: string;
}

const ModalHomeNavMenuMore : React.FC<ModalHomeNavMenuMoreProps> = ({isOpen, theme}) => {

    return (
        isOpen ? (
            <div className="modal-home-nav-manu-more-wrapper">
                <div className="modal-home-nav-menu-more-items">
                    <div className="modal-home-nav-menu-more-item-first">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Settings
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('gear')}/>
                        </div>
                    </div>
                    <div className="modal-home-nav-menu-more-item">
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

                    <div className="modal-home-nav-menu-more-item">
                        <div className='modal-home-nav-menu-more-item-text'>
                            Report
                        </div>

                        <div className='modal-home-nav-menu-more-item-icon'>
                            <FontAwesomeIcon icon={solid('circle-exclamation')}/>
                        </div>
                    </div>

                    <div className="modal-home-nav-menu-more-item-last">
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