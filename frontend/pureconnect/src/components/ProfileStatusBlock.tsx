import React, {SetStateAction} from 'react';
import {IUser} from "../interfaces/IUser";
import LocalizedStrings from "react-localization";

const ProfileStatusBlock = (props: {
    user: IUser|undefined,
    isEdit: boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser|undefined>>,
    isOpenFollowers?: boolean,
    setIsOpenFollowers?: React.Dispatch<SetStateAction<boolean>>,
    isOpenFriends?: boolean,
    setIsOpenFriends?: React.Dispatch<SetStateAction<boolean>>,
}) => {

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

    const handleLookPosts = () => {
        window.scrollTo({left: 0, top: 520, behavior: 'smooth'});
    }

    return (
        <div>
            {!props.isEdit ?
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
            :
                <div>
                    <label className={'my-profile-user-label'} htmlFor="">Status</label>
                        <textarea
                            className='login-form-input'
                            value={props.user?.status}
                            rows={15}
                            cols={15}
                            style={{ height: '200px', margin: '0', paddingTop: '10px' }}
                            onChange={(e) => {props.setUser({...props.user!, status: e.target.value})}}
                        />
                </div>
            }

            {!props.isEdit &&
            <div className='profile-user-stats'>
                <div onClick={handleLookPosts} className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.postsCount)} {strings.posts}
                    </div>
                </div>

                <div onClick={() => props.setIsOpenFollowers!(true)} className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.followersCount)} {strings.followers}
                    </div>
                </div>

                <div onClick={() => props.setIsOpenFriends!(true)} className='profile-user-stat'>
                    <div>
                        {shortenCount(props.user?.friendsCount)} {strings.friends}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default ProfileStatusBlock;