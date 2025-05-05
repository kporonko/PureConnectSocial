export interface IPost{
    postId: number;
    image: string;
    description: string;
    likesCount: number;
    commentsCount: number;
    createdAt: Date;

    avatar?: string;
    username: string;
    fullName: string;
    response: string;

    isLike: boolean;
    isMine: boolean;

    isFollowedUser: boolean;
    userId: number
}