import React from 'react';
import LocalizedStrings from "react-localization";

const CommonFriendsModalTopPanel = () => {
    const strings = new LocalizedStrings({
        en:{
            commonFriends:"Common friends",
        },
        ua: {
            commonFriends:"Спільні друзі",
        }
    });

    return (
        <div className={'friend-follower-top-panel'}>
            {strings.commonFriends}
        </div>
    );
};

export default CommonFriendsModalTopPanel;