export interface IUser {
    id: number;
    nickname: string;
    avatarUrl: string;
    isOnline?: boolean;
    signatureUrl?: string;
}

export interface IPost {
    id: number;
    author: IUser;
    title: string;
    topic: string;
    text?: string;
    content?: string;
    tags: string[];
    images: string[];
    links: { id: number; url: string; postId: number }[];
    likesCount: number;
    viewsCount: number;
    isLikedByMe: boolean;
    createdAt: string;
}

export interface PaginatedPosts {
    data: IPost[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreatePostPayload {
    title: string;
    content: string;
    topic?: string;
    tags?: string[];
    imageUrls?: string[];
    links?: { url: string; label?: string }[];
}

export interface UpdatePostPayload {
    title?: string;
    content?: string;
    topic?: string;
    tags?: string[];
    imageUrls?: string[];
    links?: { url: string; label?: string }[];
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}