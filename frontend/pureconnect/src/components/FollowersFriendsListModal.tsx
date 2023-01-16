import React, {SetStateAction, useEffect} from 'react';
import ModalEditPostTopPanel from "./ModalEditPostTopPanel";
import ModalAddEditPostContent from "./ModalAddEditPostContent";
import {IFriendFollower} from "../interfaces/IFriendFollower";
import {getMyFollowers, getMyFriends} from "../utils/FetchData";
import FollowerFriend from "./FollowerFriend";
import FollowerTopPanel from "./FollowerTopPanel";
import FriendTopPanel from "./FriendTopPanel";

const FollowersFriendsListModal = (props: {
    isFollowers: boolean,
    setIsOpenFollowers?: React.Dispatch<SetStateAction<boolean>>,
    setIsOpenFriends?: React.Dispatch<SetStateAction<boolean>>,
}) => {

    const [followers, setFollowers] = React.useState<IFriendFollower[]>();
    const [friends, setFriends] = React.useState<IFriendFollower[]>();

    const closeModal = (e:any) => {
        e.stopPropagation()
        if (props.isFollowers) {
            props.setIsOpenFollowers!(false)
        }
        else {
            props.setIsOpenFriends!(false)
        }
    }

    const getFollowers = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await getMyFollowers(token);
            const body = await response.json();
            console.log(body.users)
            setFollowers(body.users)
        }
    }
    const getFriends = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const response = await getMyFriends(token);
            const body = await response.json();
            console.log(body.users)
            setFriends(body.users)
        }
    }
    useEffect(() => {
        if (props.isFollowers) {
            getFollowers()
        }
        else {
            getFriends()
        }
    }, [])

    return (
        <div onClick={closeModal} className={'modal-followers-friends-wrapper'}>
            <div onClick={(e) => e.stopPropagation()} className="modal-followers-friends-content">

                {props.isFollowers ? <FollowerTopPanel/> : <FriendTopPanel/>}
                {props.isFollowers ?
                    followers?.map((follower, ind) => (
                        <div>
                            <FollowerFriend isFriend={false} key={ind} data={follower}/>
                        </div>
                ))
                :
                    friends?.map((friend, ind) => (
                        <div>
                            <FollowerFriend isFriend={true} key={ind} data={friend}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FollowersFriendsListModal;