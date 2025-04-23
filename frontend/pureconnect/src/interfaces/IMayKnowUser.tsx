export interface IMayKnowUser{
    userId: number;
    lastName: string;
    firstName: string;
    commonFriendsCount: number;
    avatar: string;
    isFollowed: boolean;
}

export interface ISearchedUser extends IMayKnowUser{
    userId: number;
    lastName: string;
    firstName: string;
    commonFriendsCount: number;
    avatar: string;
    username: string;
}