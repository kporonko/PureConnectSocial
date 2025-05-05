import React, {SetStateAction, useEffect} from 'react';
import LocalizedStrings from "react-localization";
import { IPostImage } from "../interfaces/IPostImage";
import {IPost} from "../interfaces/IPost";
import Post from "./Post";
import PostRecommended from "./PostRecommended";
import {getPostById} from "../utils/FetchData";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import postRecommended from "./PostRecommended";

const ModalRecommendedPostContent = (props: {
    theme: string,
    post: IPost|undefined,
    chosenPostId: number,
    setIsOpenUsersLikedPost?: React.Dispatch<SetStateAction<boolean>>,
    setCurrPostIdUsersLiked?: React.Dispatch<SetStateAction<number|undefined>>,
    setIsOpenReportPostModal?: React.Dispatch<SetStateAction<boolean>>,
    setCurrReportPostId?: React.Dispatch<React.SetStateAction<number|undefined>>,
    setCurrentPost: React.Dispatch<SetStateAction<IPost|undefined>>
}) => {



    return (
        <div className={'post-recommended-wrapper'}>
            <PostRecommended post={props.post!} setIsOpenReportPostModal={props.setIsOpenReportPostModal} setCurrPostIdUsersLiked={props.setCurrPostIdUsersLiked} setCurrReportPostId={props.setCurrReportPostId}  setIsOpenUsersLikedPost={props.setIsOpenUsersLikedPost} theme={props.theme}/>
        </div>
    );
};

export default ModalRecommendedPostContent;