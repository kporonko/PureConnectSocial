import React, {useEffect} from 'react';
import {IPost} from "../interfaces/IPost";
import {getRecommendedPosts} from "../utils/FetchData";
import Post from "./Post";
import AOS from "aos";

const RecommendedPostsList = (props:{theme: string}) => {

    const [recommendedPosts, setRecommendedPosts] = React.useState<IPost[]>();

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 100,
        });
        const fetchRecommendedPosts = async () => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const posts = await getRecommendedPosts(token);
                setRecommendedPosts(posts);
            }
        }
        fetchRecommendedPosts();
    }, []);


    return (
        <div>
            {recommendedPosts !== undefined ? recommendedPosts.map((post, index) => (
                <div data-aos={'fade-up'}>
                    <Post post={post} key={index} theme={props.theme} isMy={false}/>
                </div>
                    )) : "No recommendations"}
        </div>
    );
};

export default RecommendedPostsList;