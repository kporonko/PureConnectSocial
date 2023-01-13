import React, {SetStateAction} from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import MyProfileInfo from "./MyProfileInfo";
import MyPostsList from "./MyPostsList";
import ModalAddPost from "./ModalAddPost";
import {IPost} from "../interfaces/IPost";
import {IPostImage} from "../interfaces/IPostImage";

const MainContentMyProfile = (props: {
    theme: string,
    setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>
    setPosts: React.Dispatch<SetStateAction<IPost[]|undefined>>,
    setImages: React.Dispatch<SetStateAction<IPostImage[]|undefined>>
    posts: IPost[]|undefined,
    postsImage: IPostImage[]|undefined,
    isAdd: boolean
}) => {

    return (
        <div data-theme={props.theme} className="main-content-profile">
            <div className='main-content-profile-block'>
                <MyProfileInfo  theme={props.theme} />
                {<MyPostsList isAdd={props.isAdd} theme={props.theme} setIsActiveAddPost={props.setIsActiveAddPost} setPosts={props.setPosts} setImages={props.setImages} posts={props.posts} postsImage={props.postsImage}/>}
            </div>
        </div>
    );
};

export default MainContentMyProfile;