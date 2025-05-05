export interface IProfile{
    userId: number,
    lastName: string,
    firstName: string,
    userName: string,
    email: string,
    location: string | undefined,
    avatar: string | undefined,
    status: string | undefined,
    birthDate: string,
    postsCount: number,
    followersCount: number,
    friendsCount: number,
    isFollowed: boolean,
    myResponse: string | undefined,
    isMine: boolean
}