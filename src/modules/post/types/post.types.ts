export interface IUser {
    id: string;
    nickname: string;
    avatarUrl: string;
    isOnline?: boolean;
    signatureUrl?: string; 
}

export interface IPost {
    id: string;
    author: IUser;
    title: string;
    text: string;
    tags: string[];
    images: string[]; 
    likesCount: number;
    viewsCount: number;
    isLikedByMe: boolean;
    createdAt: string;
}