import React, {SetStateAction} from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";
import MyProfileInfo from "./MyProfileInfo";
import MyPostsList from "./MyPostsList";
import ModalAddPost from "./ModalAddPost";
import {IPost} from "../interfaces/IPost";
import {IPostImage} from "../interfaces/IPostImage";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

const MainContentMyProfile = (props: {
    theme: string,
    setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>
    setPosts: React.Dispatch<SetStateAction<IPost[]|undefined>>,
    setImages: React.Dispatch<SetStateAction<IPostImage[]|undefined>>
    posts: IPost[]|undefined,
    postsImage: IPostImage[]|undefined,
    isChangedPosts: boolean,
    setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>,
    postEdit: IPostAddRequest|undefined,
    setPostEdit: React.Dispatch<SetStateAction<IPostAddRequest>>,
    isOpenEdit: boolean,
    setIsOpenEdit: React.Dispatch<SetStateAction<boolean>>,
    isOpenEditProfile: boolean,
    setIsOpenEditProfile: React.Dispatch<SetStateAction<boolean>>,
    isToggleProfile: boolean,
    setIsToggleProfile: React.Dispatch<SetStateAction<boolean>>,
    isOpenFollowers: boolean,
    setIsOpenFollowers: React.Dispatch<SetStateAction<boolean>>,
    isOpenFriends: boolean,
    setIsOpenFriends: React.Dispatch<SetStateAction<boolean>>,
}) => {

    return (
        <div data-theme={props.theme} className="main-content-profile">
            <div className='main-content-profile-block'>
                <MyProfileInfo isOpenFollowers={props.isOpenFollowers} setIsOpenFollowers={props.setIsOpenFollowers} isOpenFriends={props.isOpenFriends} setIsOpenFriends={props.setIsOpenFriends} isToggleProfile={props.isToggleProfile} setIsToggleProfile={props.setIsToggleProfile} isActiveEditProfile={props.isOpenEditProfile} setIsOpenEditProfile={props.setIsOpenEditProfile} isEdit={false} theme={props.theme} />
                {<MyPostsList isToggleProfile={props.isToggleProfile} setIsToggleProfile={props.setIsToggleProfile} setIsOpenEdit={props.setIsOpenEdit} isOpenEdit={props.isOpenEdit} postEdit={props.postEdit} setPostEdit={props.setPostEdit} isChangedPosts={props.isChangedPosts} setIsChangedPosts={props.setIsChangedPosts} theme={props.theme} setIsActiveAddPost={props.setIsActiveAddPost} setPosts={props.setPosts} setImages={props.setImages} posts={props.posts} postsImage={props.postsImage}/>}
            </div>
        </div>
    );
};

export default MainContentMyProfile;