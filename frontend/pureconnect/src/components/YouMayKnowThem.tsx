import React, {useEffect, useState} from 'react';
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon, Props} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {IMayKnowUser} from "../interfaces/IMayKnowUser";
import MayKnowUser from "./MayKnowUser";
import {getRecommendedUsers} from "../utils/FetchData";



const YouMayKnowThem = () => {

    const isShow: boolean = localStorage.getItem('isShowMayKnowThem') === 'true' ? true : false;

    const [showMessage, setShowMessage] = useState(isShow);

    const handleClose = () => {
        setShowMessage(false);
        localStorage.setItem('isShowMayKnowThem', 'false');
    }

    let strings = new LocalizedStrings({
        en:{
            youMayKnowThem:"You may know them",
            noRecommendations:"No recommendations",
        },
        ua: {
            youMayKnowThem:"Можливо, ви знаєте їх",
            noRecommendations:"Немає рекомендацій",
        }
    });

    const [users, setUsers] = React.useState<IMayKnowUser[]>();
    useEffect( () => {
        const users = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const response = await getRecommendedUsers(token);
                setUsers(response);
            }
        }
        users()
    }, []);

    if (!showMessage) {
        return null;
    }

    return (
        <div className={'may-know-them-wrapper'}>
            <div className={'may-know-them-bar'}>
                <div>
                    {strings.youMayKnowThem}
                </div>
                <div>
                    <FontAwesomeIcon onClick={handleClose} icon={solid('x')}/>
                </div>
            </div>

            <div className={'may-know-them-content'}>
                {users !== undefined ? users.map((user, index) => (
                    <MayKnowUser user={user} key={index}/>
                )) : strings.noRecommendations}
            </div>
        </div>
    );
};

export default YouMayKnowThem;