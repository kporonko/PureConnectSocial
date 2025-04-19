import React, {SetStateAction} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {regular, solid} from "@fortawesome/fontawesome-svg-core/import.macro";

const ProfilePostsActionsPanel = (props: {isFeed: boolean,
    setIsFeed: React.Dispatch<SetStateAction<boolean>>,
    setIsActiveAddPost:  React.Dispatch<SetStateAction<boolean>>,
    isExternal?: boolean}) => {

    return (
        <div className='profile-posts-actions-panel-wrapper'>
            <div onClick={() => props.setIsFeed(true)} className={`px-size-25 ${props.isFeed && 'active-profile-display-action'}`}>
                <FontAwesomeIcon icon={solid('bars')}/>
            </div>

            <div onClick={() => props.setIsFeed(false)} className={`px-size-25 ${!props.isFeed && 'active-profile-display-action'}`}>
                <FontAwesomeIcon icon={solid('table-cells')}/>
            </div>

            {!props.isExternal &&
            <div onClick={() => props.setIsActiveAddPost(true)} className='px-size-25'>
                <FontAwesomeIcon icon={solid('add')}/>
            </div>}
        </div>
    );
};

export default ProfilePostsActionsPanel;