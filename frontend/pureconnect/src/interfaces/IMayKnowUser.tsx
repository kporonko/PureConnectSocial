export interface IMayKnowUser{
    userId: number;
    lastName: string;
    firstName: string;
    commonFriendsCount: number;
    avatar: string;
}

export interface ISearchedUser extends IMayKnowUser{
    userId: number;
    lastName: string;
    firstName: string;
    commonFriendsCount: number;
    avatar: string;
    username: string;
}