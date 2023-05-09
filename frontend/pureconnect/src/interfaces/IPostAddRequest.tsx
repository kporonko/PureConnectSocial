export interface IPostAddRequest{
    image: string;
    description: string;
    createdAt: Date|undefined;
    postId: number|undefined;
}