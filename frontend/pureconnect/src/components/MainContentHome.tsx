import React from 'react';
import YouMayKnowThem from "./YouMayKnowThem";
import RecommendedPostsList from "./RecommendedPostsList";

const MainContentHome = () => {
    return (
        <div className="main-content-home">
            <div className='main-content-home-block'>
                <YouMayKnowThem/>
                <RecommendedPostsList/>
            </div>
        </div>
    );
};

export default MainContentHome;