import React, {useState} from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import CommonFriendsModal from "./CommonFriendsModal";
import {ICommonFriend} from "../interfaces/ICommonFriend";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";

const MainContentHome = (props: {theme: string}) => {
    const [isOpenCommonFriendsModal, setIsOpenCommonFriendsModal] = useState(false);
    const [commonFriends, setCommonFriends] = useState<ICommonFriend[]>();
    const [currMayKnowUser, setCurrMayKnowUser] = useState<IMayKnowUser>();

    return (
        <div className="main-content-home">
            <div className='main-content-home-block'>
                <YouMayKnowThem setCurrMayKnowUser={setCurrMayKnowUser} setIsOpenCommonFriendsModal={setIsOpenCommonFriendsModal} theme={props.theme}/>
                <RecommendedPostsList theme={props.theme}/>
                {isOpenCommonFriendsModal &&
                    <CommonFriendsModal currMayKnowUser={currMayKnowUser} commonFriends={commonFriends} setCommonFriends={setCommonFriends} isOpenCommonFriends={isOpenCommonFriendsModal} setIsOpenCommonFriends={setIsOpenCommonFriendsModal}/>}
            </div>
        </div>
    );
};

export default MainContentHome;