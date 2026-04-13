
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
    code: number;
}

export interface LoginResponce {
	token: string;
}

export interface User {
	email: string;
	name: string;
	surname: string;
	nickname: string;
	id: number;
	avatar: string;
	lastSeenAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type MeResponse = User