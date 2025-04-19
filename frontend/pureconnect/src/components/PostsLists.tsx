import React, {SetStateAction, useEffect, useState} from 'react';
import Post from "./Post";
import {getAvatar, getMyPosts, getMyPostsImages, getPostsImagesByUserId, getPostsListByUser} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IPost} from "../interfaces/IPost";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import ProfilePostsActionsPanel from "./ProfilePostsActionsPanel";
import PostImage from "./PostImage";
import {IPostImage} from "../interfaces/IPostImage";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

const PostsList = (props:
                         {
                             theme: string,
                             setIsActiveAddPost: React.Dispatch<SetStateAction<boolean>>,
                             setPosts: React.Dispatch<SetStateAction<IPost[]|undefined>>,
                             setImages: React.Dispatch<SetStateAction<IPostImage[]|undefined>>
                             posts: IPost[]|undefined,
                             postsImage: IPostImage[]|undefined,
                             isChangedPosts: boolean|undefined,
                             setIsChangedPosts: React.Dispatch<SetStateAction<boolean>>,
                             postEdit: IPostAddRequest|undefined,
                             setPostEdit: React.Dispatch<SetStateAction<IPostAddRequest>>,
                             isOpenEdit: boolean,
                             setIsOpenEdit: React.Dispatch<SetStateAction<boolean>>,
                             isToggleProfile: boolean,
                             setIsToggleProfile: React.Dispatch<SetStateAction<boolean>>,
                             setIsOpenUsersLikedPost: React.Dispatch<SetStateAction<boolean>>,
                             setCurrPostIdUsersLiked: React.Dispatch<SetStateAction<number|undefined>>,
                             userId: string|undefined
                         }
) => {


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
    const getUserData = async() => {
        const token = localStorage.getItem('access_token');
        if (token !== null && props.userId) {
            const responsePosts = await getPostsListByUser(token, props.userId);
            const responsePostsBody = await responsePosts.json();
            if ( responsePosts.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            props.setPosts(responsePostsBody);
        }
    };
    const handleCheckImages = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && props.userId) {
            const responsePostsImages = await getPostsImagesByUserId(token, props.userId);
            const responsePostsImagesBody = await responsePostsImages.json()
            if (responsePostsImages.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            props.setImages(responsePostsImagesBody);
        }
    }

    useEffect( () => {
        if (isFeed)
            getUserData();
        else
            handleCheckImages();
    }, [isFeed, props.isChangedPosts, props.isToggleProfile]);

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, [])

    return (
        <div className={'posts-list-wrapper'}>

            <div style={{display:'flex', justifyContent:'center'}}>
                <ProfilePostsActionsPanel isExternal={true} setIsActiveAddPost={props.setIsActiveAddPost} isFeed={isFeed} setIsFeed={setIsFeed}/>
            </div>


            {isFeed ?
                <div>
                    {props.posts && props.posts.length > 0 ? props.posts?.map((post, ind) => (
                        <div data-aos={'fade-up'} key={ind} style={{display:'flex', justifyContent:'center'}}>
                            <Post setCurrPostIdUsersLiked={props.setCurrPostIdUsersLiked} setIsOpenUsersLikedPost={props.setIsOpenUsersLikedPost} setIsOpenEdit={props.setIsOpenEdit} isOpenEdit={props.isOpenEdit} postEdit={props.postEdit} setPostEdit={props.setPostEdit} isChangedPosts={props.isChangedPosts} setIsChangedPosts={props.setIsChangedPosts} key={ind} post={post} theme={props.theme} isMy={true}/>
                        </div>
                    )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
                </div>
                :
                <div className={'my-posts-images-wrapper-external'}>
                    {props.postsImage && props.postsImage.length > 0 ? props.postsImage?.map((post, ind) => (
                        <div data-aos={'fade-right'} >
                            <PostImage postImage={post} key={ind}/>
                        </div>
                    )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
                </div>
            }
        </div>

    );
};

export default PostsList;