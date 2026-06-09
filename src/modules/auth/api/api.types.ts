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

export interface VerifyDTO {
	code: string;
}

export interface LoginResponse {
	token: string;
}

export interface UserProfile {
	id: number;
	userId: number;
	birthDate: string | null;
	signature: string | null;
	pseudonym: string | null;
	avatar: string | null;
	isImageSignature: boolean;
	isTextSignature: boolean;
}

export interface User {
	id: number;
	email: string;

	username: string | null;
	firstName: string | null;
	lastName: string | null;
	signature: string | null;

	dateJoined: string;
	lastLogin: string;

	isActive: boolean;
	isStaff: boolean;
	isSuperuser: boolean;

	profile: UserProfile | null;
}

export interface UpdateProfilePayload {
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    signature?: string | null;
    profile?: {
        pseudonym?: string | null;
        birthDate?: string | null;
        signature?: string | null;
        avatar?: string | null;
    };
}

export type MeResponse = User;