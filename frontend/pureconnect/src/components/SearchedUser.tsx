import React from 'react';
import {IMayKnowUser, ISearchedUser} from "../interfaces/IMayKnowUser";
import LocalizedStrings from "react-localization";
import person from '../assets/user.png'

const SearchedUser = (props: {user: ISearchedUser, handleUserClick: any}) => {

    const strings = new LocalizedStrings({
        en: {
            commonFriends: "Common friends: ",
        },
        ua: {
            commonFriends: "Спільні друзі: ",
        }
    });
    return (
        <div
            key={props.user.userId}
            className="searched-user-item"
            onClick={() => props.handleUserClick(props.user)}
        >
            <div className="searched-user-avatar-wrapper">
                <img className={'searched-user-avatar-image'} src={props.user.avatar? props.user.avatar : person } alt={`${props.user.firstName} ${props.user.lastName}`} />
            </div>
            <div className="searched-user-info">
                <div className="searched-user-name">{props.user.firstName} {props.user.lastName}</div>
                <div className="searched-user-name">@{props.user.username}</div>
                <div className="searched-user-common-friends">
                    {strings.commonFriends}{props.user.commonFriendsCount}
                </div>
            </div>
        </div>
    );
};

export default SearchedUser;