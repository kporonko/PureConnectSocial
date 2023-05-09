import React, {useRef} from 'react';
import MayKnowUser from "./MayKnowUser";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";
import LocalizedStrings from "react-localization";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const MayKnowUsersList = (props: {
    users: IMayKnowUser[] | undefined,
    theme: string,
    setIsOpenCommonFriendsModal: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrMayKnowUser: React.Dispatch<React.SetStateAction<IMayKnowUser | undefined>>,
}) => {

    let strings = new LocalizedStrings({
        en:{
            noRecommendations:"No recommendations",
            errorMayKnowLoading:"Error loading recommendations",
        },
        ua: {
            noRecommendations:"Немає рекомендацій",
            errorMayKnowLoading:"Помилка завантаження рекомендацій",
        }
    });

    return (
        <div className={'may-know-them-content'}>

            {props.users !== undefined ? props.users.length > 0 ? props.users.map((user, index) => (
                <MayKnowUser setCurrMayKnowUser={props.setCurrMayKnowUser} setIsOpenCommonFriendsModal={props.setIsOpenCommonFriendsModal} user={user} key={index} theme={props.theme}/>
                    )) : strings.noRecommendations : strings.errorMayKnowLoading}
        </div>
    );
};

export default MayKnowUsersList;