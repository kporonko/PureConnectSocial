export interface IUser {
    userId: number,
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    location: string | undefined,
    birthDate: string,
    avatar: string | undefined,
    userName: string,
    status: string | undefined,
    postsCount: number,
    followersCount: number,
    friendsCount: number,
}

