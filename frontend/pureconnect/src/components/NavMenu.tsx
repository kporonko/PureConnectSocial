import React, {useState} from 'react';
import mainLogoBlack from '../assets/pure connect icon black.png'
import mainLogoWhite from '../assets/pure connect icon white.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {Link} from "react-router-dom";
import ModalHomeNavMenuMore from "./ModalHomeNavMenuMore";

export enum Page { Home, Search, Notifications, Profile, Chats = 4};

const NavMenu = (props: {page: Page, theme: string, setTheme: any, avatar: string}) => {

    const [isModalHomeNavMenuMoreOpen, setIsModalHomeNavMenuMoreOpen] = useState(false);
    const changeModalHomeNavMenuMoreOpen = () => setIsModalHomeNavMenuMoreOpen(!isModalHomeNavMenuMoreOpen);

    return (
        <div className={"nav-menu-wrapper"}>
            <div className={"nav-menu-image-wrapper"}>
                <img className={"nav-menu-image"} src={props.theme == 'dark' ? mainLogoWhite : mainLogoBlack} alt="logo"/>
            </div>
            <div className={"nav-content"}>
                <ul className={"nav-menu-items"}>
                    <li className={props.page == Page.Home ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('home')} />
                        </div>
                        <div className={"nav-menu-item-text"}>Main Page</div>
                    </li>
                    <li className={props.page == Page.Search ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('search')} />
                        </div>
                        <div className={"nav-menu-item-text"}>Search</div>
                    </li>
                    <li className={props.page == Page.Chats ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('comments')} />
                        </div>
                        <div className={"nav-menu-item-text"}>Chats</div>
                    </li>
                    <li className={props.page == Page.Notifications ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('bell')} />
                        </div>
                        <div className={"nav-menu-item-text"}>Notifications</div>
                    </li>
                    <li className={props.page == Page.Profile ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <img className={'nav-menu-avatar-profile-image'} src={props.avatar} alt=""/>
                        </div>
                        <div className={"nav-menu-item-text"}>Profile</div>
                    </li>
                </ul>

                <ModalHomeNavMenuMore setTheme={props.setTheme} theme={props.theme} isOpen={isModalHomeNavMenuMoreOpen}/>
                <div onClick={changeModalHomeNavMenuMoreOpen} className={isModalHomeNavMenuMoreOpen ? "nav-more nav-more-active" : "nav-more"}>
                    <FontAwesomeIcon className={'nav-icon'} icon={solid('bars')} />
                    <div className={"nav-menu-item-text"}>More</div>
                </div>
            </div>
        </div>
    );
};

export default NavMenu;