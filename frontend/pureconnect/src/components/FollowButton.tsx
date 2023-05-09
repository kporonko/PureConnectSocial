import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import LocalizedStrings from "react-localization";

const FollowButton = (props: {userId: number}) => {
    const strings = new LocalizedStrings({
        en:{
            follow:"Follow",
        },
        ua: {
            follow:"Підписатися",
        }
    });

    return (
        <div className={'may-know-user-button'}>
            <div>
                <FontAwesomeIcon icon={solid('user-plus')}/>
            </div>
            <div>
                {strings.follow}
            </div>
        </div>
    );
};

export default FollowButton;