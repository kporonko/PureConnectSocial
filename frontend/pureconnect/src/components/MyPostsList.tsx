import React, {useEffect} from 'react';
import Post from "./Post";
import {getAvatar, getMyPosts} from "../utils/FetchData";
import {toast} from "react-toastify";
import {IPost} from "../interfaces/IPost";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";

 const MyPostsList = (props: {theme: string}) => {

    const [posts, setPosts] = React.useState<IPost[]>();

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

    useEffect( () => {
        const getUserData = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const responsePosts = await getMyPosts(token);
                if ( responsePosts.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                setPosts(responsePosts);
            }
        };
        getUserData();
    }, []);

    return (
        <div className={'my-posts-wrapper'}>
            {posts && posts.length > 0 ? posts?.map((post, ind) => (
                <Post key={ind} post={post} theme={props.theme} isMy={true}/>
            )) : <div style={{marginTop: '5rem'}} className={'status-text'}>{strings.noposts}</div>}
        </div>
    );
};

export default MyPostsList;