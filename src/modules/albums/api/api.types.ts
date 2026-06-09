export type AlbumVisibility = "public" | "private";

export interface AlbumImage {
    id: number;
    albumId: number;
    userId: number;
    photoName: string;    
    visibility: AlbumVisibility; 
    createdAt: string;
    updatedAt: string;
}

export interface Album {
    id: number;
    profileId: number;       
    name: string;
    theme: string | null;   
    year: number | null;
    isShown: boolean;   
    isDefault: boolean;     
    createdAt: string;
    images: AlbumImage[];  
}

export interface CreateAlbumPayload {
    name: string;
    theme?: string | null;
    year?: number | null;
    isShown: boolean;
}

export interface UpdateAlbumPayload {
    name?: string;
    theme?: string | null;
    year?: number | null;
}

export interface UpdateAlbumVisibilityPayload {
    isShown: boolean;
}