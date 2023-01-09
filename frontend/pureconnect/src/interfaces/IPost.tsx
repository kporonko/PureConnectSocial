export interface IPost{
    id: number;
    image: string;
    description: string;
    likesCount: number;
    commentsCount: number;
    createdAt: Date;

    avatar?: string;
    username: string;
    fullName: string;
    response: string;

    isLike: boolean
}