import React from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";

const ProfileStatusBlock = (props: {user: IUser|undefined}) => {

    let strings = new LocalizedStrings({
        en:{
            status:"Status",
            posts: 'Posts',
            followers: 'Followers',
            friends: 'Friends',
            nostatus: 'No status',
            thousandShort:'k',
            millionShort:'m',
        },
        ua: {
            status:'Статус',
            posts: 'Постів',
            followers: 'Підписників',
            friends: 'Друзів',
            nostatus: 'Немає статусу',
            thousandShort:'тис',
            millionShort:'млн',
        }
    });

    function shortenCount(count: number|undefined) {
        if (count === undefined) {
            return null;
        }
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + strings.millionShort
        }        else if (count >= 1000) {
            return (count / 1000).toFixed(1) + strings.thousandShort;
        }
        return count;
    }

    return (
        <div>
            <div className='profile-user-status'>
                <h6 className={'my-profile-user-label'}>
                    {strings.status}
                </h6>
                {props.user?.status === null ?
                    <div className={'no-status'}>
                        {strings.nostatus}
                    </div>
                    :
                    <div className={'status-text'}>
                        {decodeURI(props.user?.status!)}
                    </div>}
            </div>

            <div className='profile-user-stats'>
                <div className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.postsCount)} {strings.posts}
                    </div>
                </div>

                <div className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.followersCount)} {strings.followers}
                    </div>
                </div>

                <div className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.friendsCount)} {strings.friends}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileStatusBlock;