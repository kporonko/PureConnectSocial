import React, {useState} from 'react';
import {IMayKnowUser} from "../interfaces/IMayKnowUser";
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {regular, solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import user from "../assets/user.png";
import {followUser, unfollowUser} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
const MayKnowUser = (props:{
    user: IMayKnowUser,
    theme: string,
    setIsOpenCommonFriendsModal: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrMayKnowUser: React.Dispatch<React.SetStateAction<IMayKnowUser | undefined>>,
}) => {

    let strings = new LocalizedStrings({
        en:{
            common:"common friends",
            follow:"Follow",
            followed: "Followed",
            error: "Error... Try again later.",
            successFollow: "Followed successfully.",
            successUnfollow:"Unfollowed successfully"
        },
        ua: {
            common:"спільних друзів",
            follow:"Підписатися",
            followed: "Підписано",
            error: "Сталася помилка... Спробуйте ще раз пізніше.",
            successFollow: "Ви успішно підписалися на користувача.",
            successUnfollow: "Ви відписалися від користувача"
        }
    });

    const [followed, setFollowed] = useState(false)
    const [isValidAvatar, setIsValidAvatar] = React.useState(false);

    React.useEffect(() => {
        const image = new Image();
        image.src = props.user.avatar;
        image.onload = () => setIsValidAvatar(true);
        image.onerror = () => setIsValidAvatar(false);
    }, [props.user.avatar]);

    const handleFollow = async () => {
        const token = localStorage.getItem('access_token')

        if (!followed){
            const res = await followUser(token, props.user.userId);
            if (res instanceof Error){
                const notify = () => toast.error(strings.error);
                notify();
            }
            else{
                setFollowed(!followed)
                const notify = () => toast.success(strings.successFollow);
                notify();
            }
        }
        else{
            const res = await unfollowUser(token, props.user.userId);
            if (res instanceof Error){
                const notify = () => toast.error(strings.error);
                notify();
            }
            else{
                setFollowed(!followed)
                const notify = () => toast.success(strings.successUnfollow);
                notify();
            }
        }

    }

    return (
        <div className='may-know-user'>
            <img className='may-know-user-image' src={isValidAvatar? props.user.avatar : user} alt=""/>
            <div  className='may-know-user-name'>
                {props.user.lastName} {props.user.firstName}
            </div>
            <div onClick={() => {
                props.setIsOpenCommonFriendsModal(true)
                props.setCurrMayKnowUser(props.user)
            }} className='may-know-user-friends-count'>
                {props.user.commonFriendsCount} {strings.common}
            </div>

            <div onClick={handleFollow} className={followed ? 'may-know-user-button may-know-user-button-followed' : 'may-know-user-button'}>
                <div>
                    <FontAwesomeIcon icon={solid('user-plus')}/>
                </div>
                <div>
                    {followed ? strings.followed : strings.follow}
                </div>
            </div>
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

export default MayKnowUser;