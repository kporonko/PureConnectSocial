import React, {SetStateAction} from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import MyProfileInfo from "./MyProfileInfo";
import MyPostsList from "./MyPostsList";
import ModalAddPost from "./ModalAddPost";

const MainContentMyProfile = (props: {theme: string, setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>}) => {


    return (
        <div data-theme={props.theme} className="main-content-profile">
            <div className='main-content-profile-block'>
                <MyProfileInfo/>
                <MyPostsList setIsActiveAddPost={props.setIsActiveAddPost} theme={props.theme}/>
            </div>
        </div>
    );
};

export default MainContentMyProfile;