import React from 'react';
import LocalizedStrings from "react-localization";

const FollowerTopPanel = () => {
    const strings = new LocalizedStrings({
        en:{
            followers:"Followers",
        },
        ua: {
            followers:"Підписники",
        }
    });

    return (
        <div className={'friend-follower-top-panel'}>
            {strings.followers}
        </div>
    );
};

export default FollowerTopPanel;