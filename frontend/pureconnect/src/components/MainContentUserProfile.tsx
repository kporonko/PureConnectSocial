import React, {SetStateAction} from 'react';
import {IProfile} from "../interfaces/IProfile";
import {IPostImage} from "../interfaces/IPostImage";
import {IPost} from "../interfaces/IPost";
import MyProfileInfo from "./MyProfileInfo";
import ProfileInfo from "./ProfileInfo";
import PostsList from "./PostsLists";

const MainContentUserProfile = (props:{
    setCurrPostIdUsersLiked: React.Dispatch<SetStateAction<number|undefined>>,
    setIsOpenUsersLikedPost: React.Dispatch<SetStateAction<boolean>>,
    user: IProfile|undefined,
    setUser: React.Dispatch<SetStateAction<IProfile|undefined>>,
    isOpenFollowers: boolean,
    isOpenFriends: boolean,
    setIsOpenFollowers: React.Dispatch<SetStateAction<boolean>>,
    setIsOpenFriends: React.Dispatch<SetStateAction<boolean>>,
    theme: string,
    posts: IPost[]|undefined,
    postsImage: IPostImage[]|undefined,
    setPosts: React.Dispatch<SetStateAction<IPost[]| undefined>>,
    setImagePosts: React.Dispatch<SetStateAction<IPostImage[]| undefined>>,
    userId: string |undefined
}) => {

    console.log(props.user)
    return (
        <div className={'main-content-profile'}>
            <ProfileInfo isOpenFollowers={props.isOpenFollowers} isOpenFriends={props.isOpenFriends} setIsOpenFriends={props.setIsOpenFriends} setIsOpenFollowers={props.setIsOpenFollowers} user={props.user} setUser={props.setUser} theme={props.theme}/>
            <PostsList userId={props.userId} theme={props.theme} setIsActiveAddPost={() => {}} setPosts={props.setPosts} setImages={props.setImagePosts} posts={props.posts} postsImage={props.postsImage} isChangedPosts={false} setIsChangedPosts={() => {}} postEdit={undefined} setPostEdit={() => {}} isOpenEdit={false} setIsOpenEdit={() => {}} isToggleProfile={false} setIsToggleProfile={() => {}} setIsOpenUsersLikedPost={() => {}} setCurrPostIdUsersLiked={() => {}}/>
        </div>
    );
};

export default MainContentUserProfile;