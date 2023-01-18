import React from 'react';
import LocalizedStrings from "react-localization";

const UsersLikedPostTopPanel = () => {
    const strings = new LocalizedStrings({
        en:{
            likedPost:"People Liked This Post",
        },
        ua: {
            likedPost:"Люди, яким сподобався пост",
        }
    });

    return (
        <div className={'friend-follower-top-panel'}>
            {strings.likedPost}
        </div>
    );
};

export default UsersLikedPostTopPanel;