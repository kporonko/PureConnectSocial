import React from 'react';
import mainLogoWhite from "../assets/pure connect icon white.png";
import mainLogoBlack from "../assets/pure connect icon black.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import person from "../assets/user.png";
import ModalHomeNavMenuMore from "./ModalHomeNavMenuMore";
import ModalReport from "./ModalReport";
import {Page} from "./NavMenu";
import adminHome from "../pages/AdminHome";
import LocalizedStrings from "react-localization";
import {useNavigate} from "react-router";

export enum AdminPage {
    Home = 'home',
    PostReports = 'post-reports',
    Post = 'post',
}

const AdminNav = (props:{
    theme: string,
    setTheme: any,
    page: AdminPage,
}) => {

    const strings = new LocalizedStrings({
        en:{
            home:"Reports",
            postreports:"Post Reports",
            posts:"Post",
        },
        ua: {
            home:"Скарги",
            postreports:"Скарги про пости",
            posts:"Пости",
        }
    })

    const nav = useNavigate()
    const handleHome = () => {
        nav('/admin-home')
    }

    const handlePostReports = () => {
        nav('/admin-post-reports')
    }

    return (
        <div data-theme={props.theme} className={"nav-menu-wrapper"}>
            <div className={"nav-menu-image-wrapper"}>
                <img className={"nav-menu-image"} src={props.theme == 'dark' ? mainLogoWhite : mainLogoBlack} alt="logo"/>
            </div>
            <div className={"nav-content"}>
                <ul className={"nav-menu-items"}>
                    <li onClick={handleHome} className={props.page == AdminPage.Home ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('circle-exclamation')} />
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.home}</div>
                    </li>
                    <li onClick={handlePostReports} className={props.page == AdminPage.PostReports ? "nav-menu-item active-page" : "nav-menu-item"}>
                        <div className={"nav-menu-item-icon-wrapper"}>
                            <FontAwesomeIcon className={'nav-icon'} icon={solid('exclamation')} />
                        </div>
                        <div className={"nav-menu-item-text"}>{strings.postreports}</div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminNav;