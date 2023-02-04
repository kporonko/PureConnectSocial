import React, {useState} from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import CommonFriendsModal from "./CommonFriendsModal";
import {ICommonFriend} from "../interfaces/ICommonFriend";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";

const MainContentHome = (props: {
    theme: string,
    setCurrMayKnowUser: React.Dispatch<React.SetStateAction<IMayKnowUser|undefined>>,
    setIsOpenCommonFriendsModal: React.Dispatch<React.SetStateAction<boolean>>,
}) => {


    return (
        <div className="main-content-home">
            <div className='main-content-home-block'>
                <YouMayKnowThem setCurrMayKnowUser={props.setCurrMayKnowUser} setIsOpenCommonFriendsModal={props.setIsOpenCommonFriendsModal} theme={props.theme}/>
                <RecommendedPostsList theme={props.theme}/>
            </div>
        </div>
    );
};

export default MainContentHome;