import React, {useEffect, useState} from 'react';
import NavMenu, {Page} from "../components/NavMenu";
import {getAvatar} from "../utils/FetchData";
import MainContentHome from "../components/MainContentHome";
import {useNavigate} from "react-router";
import {toast, ToastContainer} from "react-toastify";
import LocalizedStrings from "react-localization";
import internal from "stream";
import CommonFriendsModal from "../components/CommonFriendsModal";
import {ICommonFriend} from "../interfaces/ICommonFriend";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";
import ModalReport from "../components/ModalReport";

const Home = (props: {theme: string, setTheme: any}) => {

    const [avatarImage, setAvatarImage] = React.useState("");
    const nav = useNavigate();
    let strings = new LocalizedStrings({
        en:{
            expired:"Your session is expired. Please log in again.",
        },
        ua: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    });

    useEffect( () => {
        const avatar = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const response = await getAvatar(token);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                const body = await response.json();
                setAvatarImage(body.avatar);
            }
        };
        avatar();
    }, []);

    const [isOpenCommonFriendsModal, setIsOpenCommonFriendsModal] = useState(false);
    const [commonFriends, setCommonFriends] = useState<ICommonFriend[]>();
    const [currMayKnowUser, setCurrMayKnowUser] = useState<IMayKnowUser>();

    const [isOpenReportPostModal, setIsOpenReportPostModal] = useState(false);
    const [currReportPostId, setCurrReportPostId] = useState<number>();
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <div className={'home-wrapper-2'}>
                <NavMenu page={Page.Home} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
                <MainContentHome setCurrReportPostId={setCurrReportPostId} setIsOpenReportPostModal={setIsOpenReportPostModal} setIsOpenCommonFriendsModal={setIsOpenCommonFriendsModal} setCurrMayKnowUser={setCurrMayKnowUser} theme={props.theme}/>
            </div>
            {isOpenCommonFriendsModal &&
                <CommonFriendsModal currMayKnowUser={currMayKnowUser} commonFriends={commonFriends} setCommonFriends={setCommonFriends} isOpenCommonFriends={isOpenCommonFriendsModal} setIsOpenCommonFriends={setIsOpenCommonFriendsModal}/>}
            {isOpenReportPostModal &&
                <ModalReport isPost={true} postId={currReportPostId} isModalReportOpen={isOpenReportPostModal} setIsModalReportOpen={setIsOpenReportPostModal}/>}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={props.theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default Home;