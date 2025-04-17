import React, {SetStateAction} from 'react';
import SearchUsers from "./SearchUsers";
import RecommendedPosts from "./RecommendedPosts";

const MainContentSearch = (props: {theme: string,
    isActivePostModal: boolean,
    setIsActivePostModal: React.Dispatch<SetStateAction<boolean>>,
    chosenPostId: number|undefined,
    setChosenPostId: React.Dispatch<SetStateAction<number|undefined>>
}) => {

    return (
        <div className={'main-content-search'}>
            <SearchUsers theme={props.theme}/>
            <RecommendedPosts setChosenPostId={props.setChosenPostId} theme={props.theme} chosenPostId={props.chosenPostId} setIsActiveAddPost={props.setIsActivePostModal} isActiveAddPost={props.isActivePostModal}/>
        </div>
    );
};

export default MainContentSearch;