import React from 'react';
import LocalizedStrings from "react-localization";

const FriendTopPanel = () => {
    const strings = new LocalizedStrings({
        en:{
            friends:"Friends",
        },
        ua: {
            friends:"Друзі",
        }
    });

    return (
        <div className={'friend-follower-top-panel'}>
            {strings.friends}
        </div>
    );
};

export default FriendTopPanel;