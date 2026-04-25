export type AlbumVisibility = "public" | "private";
export type AlbumType = "system" | "custom";

export interface AlbumImage {
    id: number;
    imageId: number;
    albumId: number;
    visibility: AlbumVisibility;
    image: {
        id: number;
        shakalImageURL: string | null;
        normalImageURL: string | null;
        pathname: string | null;
        uploaded_at: string;
    };
}

export interface AlbumAvatar {
    id: number;
    avatarId: number;
    albumId: number;
    avatar: {
        id: number;
        isActive: boolean;
        isShown: boolean;
        imageId: number;
        image: {
            id: number;
            shakalImageURL: string | null;
            normalImageURL: string | null;
        };
    };
}

export interface Album {
    id: number;
    userId: number;
    name: string;
    tag: string | null;
    year: number | null;
    visibility: AlbumVisibility;
    type: AlbumType;
    createdAt: string;
    updatedAt: string;
    images: AlbumImage[];
    avatars: AlbumAvatar[];
}

export interface CreateAlbumPayload {
    name: string;
    tag?: string | null;
    year?: number | null;
    visibility: AlbumVisibility;
}

export interface UpdateAlbumPayload {
    name?: string;
    tag?: string | null;
    year?: number | null;
}

export interface UpdateAlbumVisibilityPayload {
    visibility: AlbumVisibility;
}