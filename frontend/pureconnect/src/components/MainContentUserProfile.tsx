import React, {SetStateAction} from 'react';
import {IProfile} from "../interfaces/IProfile";
import {IPostImage} from "../interfaces/IPostImage";
import {IPost} from "../interfaces/IPost";

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
}) => {
    return (
        <div>

        </div>
    );
};

export default MainContentUserProfile;