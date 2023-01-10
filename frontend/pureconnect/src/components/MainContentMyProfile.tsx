import React from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import MyProfileInfo from "./MyProfileInfo";
import MyPostsList from "./MyPostsList";

const MainContentMyProfile = (props: {theme: string}) => {
    return (
        <div data-theme={props.theme} className="main-content-profile">
            <div className='main-content-profile-block'>
                <MyProfileInfo/>
                <MyPostsList theme={props.theme}/>
            </div>
        </div>
    );
};

export default MainContentMyProfile;