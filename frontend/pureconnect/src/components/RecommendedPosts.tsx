import React, {SetStateAction, useEffect, useState} from 'react';
import {getAvatar, getMyPosts, getSearchRecommendedPosts} from "../utils/FetchData";
import {IPost} from "../interfaces/IPost";
import {IPostImage} from "../interfaces/IPostImage";
import PostImage from "./PostImage";
import LocalizedStrings from "react-localization";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import PostImageSearch from "./PostImageSearch";

interface PostImageResponse {
    postId: number;
    image: string;
}


const RecommendedPosts = (props: {theme: string,
    isActiveAddPost: boolean,
    setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>,
    chosenPostId: number|undefined,
    setChosenPostId: React.Dispatch<SetStateAction<number|undefined>>
}) => {

    const [posts, setPosts] = React.useState<IPostImage[]>();

    const nav = useNavigate();

    let strings = new LocalizedStrings({
        en:{
            noposts:"No posts",
            expired:"Your session is expired. Please login again"
        },
        ua: {
            noposts:"Нема постів",
            expired:"Ваша сесія закінчилася. Будь-ласка, залогіньтеся заново"
        }
    });

    useEffect( () => {
        const getPosts = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responsePosts = await getSearchRecommendedPosts(token);
                const responsePostsBody = await responsePosts.json();
                if ( responsePosts.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                setPosts(responsePostsBody);
            }
        };
        getPosts();
    }, []);

    return (
        <div className={'my-posts-images-wrapper'}>
            {posts && posts.length > 0 ? posts?.map((post, ind) => (
                <PostImageSearch setChosenPostId={props.setChosenPostId} chosenPostId={props.chosenPostId} setIsActiveAddPost={props.setIsActiveAddPost} isActiveAddPost={props.isActiveAddPost} postImage={post} key={ind}/>
            )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
        </div>
    );
};

export default RecommendedPosts;