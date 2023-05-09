import React from 'react';
import LocalizedStrings from "react-localization";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

const UnFollowButton = (props: {userId: number}) => {
    const strings = new LocalizedStrings({
        en:{
            unfollow:"Unfollow",
        },
        ua: {
            unfollow:"Відписатися",
        }
    });

    return (
        <div className={'may-know-user-button pink'}>
            <div>
                <FontAwesomeIcon icon={solid('user-xmark')}/>
            </div>
            <div>
                {strings.unfollow}
            </div>
        </div>
    );
};

export default UnFollowButton;