import React from 'react';
import mainLogoBlack from '../assets/pure connect icon black.png'
import mainLogoWhite from '../assets/pure connect icon white.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {Link} from "react-router-dom";

export enum Page { Home, Search, Notifications, Profile, Chats = 4};

const NavMenu = (props: {page: Page, theme: string}) => {
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
                        <img src="" alt=""/>
                        <div className={"nav-menu-item-text"}>Profile</div>
                    </li>
                </ul>
                <div className={"nav-more"}>
                    <FontAwesomeIcon className={'nav-icon'} icon={solid('bars')} />
                    <div className={"nav-menu-item-text"}>More</div>
                </div>
            </div>
        </div>
    );
};

export default NavMenu;