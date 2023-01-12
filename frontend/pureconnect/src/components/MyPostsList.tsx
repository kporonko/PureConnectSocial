import React, {SetStateAction, useEffect, useState} from 'react';
import Post from "./Post";
import {getAvatar, getMyPosts, getMyPostsImages} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IPost} from "../interfaces/IPost";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import ProfilePostsActionsPanel from "./ProfilePostsActionsPanel";
import PostImage from "./PostImage";
import {IPostImage} from "../interfaces/IPostImage";

 const MyPostsList = (props: {theme: string, setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>}) => {

    const [posts, setPosts] = React.useState<IPost[]>();
    const [postsImage, setPostsImage] = React.useState<IPostImage[]>();

    const nav = useNavigate();
    let strings = new LocalizedStrings({
        en:{
            expired:"Your session is expired. Please log in again.",
            noposts:"No posts yet",
        },
        ua: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
            noposts:"Поки що немає постів",
        }
    });
     const [isFeed, setIsFeed] = useState(true)

    useEffect( () => {
        const getUserData = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responsePosts = await getMyPosts(token);
                const responsePostsBody = await responsePosts.json();
                if ( responsePosts.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                setPosts(responsePostsBody);
            }
        };
        const handleCheckImages = async () => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responsePostsImages = await getMyPostsImages(token);
                const responsePostsImagesBody = await responsePostsImages.json()
                if (responsePostsImages.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                setPostsImage(responsePostsImagesBody);
            }
        }
        console.log(isFeed)
        if (isFeed)
            getUserData();
        else
            handleCheckImages();
    }, [isFeed]);



    return (
        <div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <ProfilePostsActionsPanel setIsActiveAddPost={props.setIsActiveAddPost} isFeed={isFeed} setIsFeed={setIsFeed}/>
            </div>


            {isFeed ?
            <div>
                {posts && posts.length > 0 ? posts?.map((post, ind) => (
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <Post key={ind} post={post} theme={props.theme} isMy={true}/>
                    </div>
                )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
            </div>
            :
                <div className={'my-posts-images-wrapper'}>
                    {postsImage && postsImage.length > 0 ? postsImage?.map((post, ind) => (
                        <PostImage postImage={post} key={ind}/>
                    )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
                </div>
            }
        </div>

    );
};

export default MyPostsList;