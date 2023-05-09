import React, {useEffect} from 'react';
import FollowerTopPanel from "./FollowerTopPanel";
import FriendTopPanel from "./FriendTopPanel";
import FollowerFriend from "./FollowerFriend";
import {ICommonFriend} from "../interfaces/ICommonFriend";
import CommonFriendsModalTopPanel from "./CommonFriendsModalTopPanel";
import CommonFriend from "./CommonFriend";
import {getCommonFriends} from "../utils/FetchData";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";

const CommonFriendsModal = (props:{
    isOpenCommonFriends: boolean,
    setIsOpenCommonFriends: React.Dispatch<React.SetStateAction<boolean>>,
    commonFriends: ICommonFriend[]|undefined,
    setCommonFriends: React.Dispatch<React.SetStateAction<ICommonFriend[]|undefined>>,
    currMayKnowUser: IMayKnowUser|undefined,
}) => {

    const closeModal = () => {
        props.setIsOpenCommonFriends(false)
    }

    const getCommonFriendsList = async () => {
        const token = localStorage.getItem('access_token')
        if (token){
            const response = await getCommonFriends(token, props.currMayKnowUser!.userId)
            const body = await response.json()
            props.setCommonFriends(body)
        }
    }

    useEffect(() => {
        getCommonFriendsList()
    }, [])

    return (
        <div onClick={closeModal} className={'modal-followers-friends-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-followers-friends-content">
                <CommonFriendsModalTopPanel/>
                {props.commonFriends?.map((friend, index) => (
                    <CommonFriend setCommonFriends={props.setCommonFriends} key={index} friend={friend}/>
                ))}
            </div>
        </div>
    );
};

export default CommonFriendsModal;