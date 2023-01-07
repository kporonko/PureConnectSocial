import React, {useState} from 'react';
import mainLogoBlack from '../assets/pure connect icon black.png'
import mainLogoWhite from '../assets/pure connect icon white.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {Link} from "react-router-dom";
import ModalHomeNavMenuMore from "./ModalHomeNavMenuMore";
import LocalizedStrings from "react-localization";
import person from '../assets/user.png'

export enum Page { Home, Search, Notifications, Profile, Chats = 4};

const NavMenu = (props: {page: Page, theme: string, setTheme: any, avatar: string}) => {

    const [isModalHomeNavMenuMoreOpen, setIsModalHomeNavMenuMoreOpen] = useState(false);
    const changeModalHomeNavMenuMoreOpen = () => setIsModalHomeNavMenuMoreOpen(!isModalHomeNavMenuMoreOpen);

    let strings = new LocalizedStrings({
        en:{
            main:"Main Page",
            search:"Search",
            chats:"Chats",
            notif:"Notifications",
            profile:"Profile",
            more:"More",
            settings:"Settings",
            changeTheme:"Change Theme",
            report:"Report",
            exit:"Exit"
        },
        ua: {
            main:"Головна",
            search:"Пошук",
            chats:"Чати",
            notif:"Сповіщення",
            profile:"Профіль",
            more:"Більше",
            settings:"Налаштування",
            changeTheme:"Змінити тему",
            report:"Повідомити про проблему",
            exit:"Вийти"
        }
    });

    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        const image = new Image();
        image.src = props.avatar;
        image.onload = () => setIsValidAvatar(true);
        image.onerror = () => setIsValidAvatar(false);
    }, [props.avatar]);

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
                        <div className={"nav-menu-item-text"}>{strings.main}</div>
                    </li>
                    <li className={props.page == Page.Search ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('search')} />
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.search}</div>
                    </li>
                    <li className={props.page == Page.Chats ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('comments')} />
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.chats}</div>
                    </li>
                    <li className={props.page == Page.Notifications ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('bell')} />
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.notif}</div>
                    </li>
                    <li className={props.page == Page.Profile ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <img className={'nav-menu-avatar-profile-image'} src={!isValidAvatar ? person : props.avatar} alt=""/>
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.profile}</div>
                    </li>
                </ul>

                <ModalHomeNavMenuMore setTheme={props.setTheme} theme={props.theme} isOpen={isModalHomeNavMenuMoreOpen}/>
                <div onClick={changeModalHomeNavMenuMoreOpen} className={isModalHomeNavMenuMoreOpen ? "nav-more nav-more-active" : "nav-more"}>
                    <FontAwesomeIcon className={'nav-icon'} icon={solid('bars')} />
                    <div className={"nav-menu-item-text"}>{strings.more}</div>
                </div>
            </div>
        </div>
    );
};

export default NavMenu;