import React from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";

const MainContentHome = (props: {theme: string}) => {
    return (
        <div className="main-content-home">
            <div className='main-content-home-block'>
                <YouMayKnowThem theme={props.theme}/>
                <RecommendedPostsList theme={props.theme}/>
            </div>
        </div>
    );
};

export default MainContentHome;