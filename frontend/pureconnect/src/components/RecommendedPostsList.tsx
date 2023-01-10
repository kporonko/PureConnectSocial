import React, {useEffect} from 'react';
import {IPost} from "../interfaces/IPost";
import {getRecommendedPosts} from "../utils/FetchData";
import Post from "./Post";

const RecommendedPostsList = (props:{theme: string}) => {

    const [recommendedPosts, setRecommendedPosts] = React.useState<IPost[]>();

    useEffect(() => {
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
                <Post post={post} key={index} theme={props.theme} isMy={false}/>
                    )) : "No recommendations"}
        </div>
    );
};

export default RecommendedPostsList;