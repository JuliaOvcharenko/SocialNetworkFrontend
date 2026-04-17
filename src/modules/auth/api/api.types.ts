
export interface RegPayload {
	email: string;
	password: string;
}

export interface RegResponse {
	code: number;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface VerifyDTO{
    code: string;
}

export interface LoginResponce {
	token: string;
}

export interface User {
    id: number;
    email: string;
    
    name: string | null;
    surname: string | null;
    nickname: string | null;
    

    authorAlias: string | null; 
    birthDate: string | null; 
    

    avatars: { 
        id: number; 
        url: string; 
        isMain: boolean; 
    }[]; 
    
    lastSeenAt: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type MeResponse = User