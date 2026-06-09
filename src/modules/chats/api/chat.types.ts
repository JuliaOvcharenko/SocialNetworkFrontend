export interface IChatProfile {
	id: number;
	avatar: string | null;
	pseudonym: string | null;
}

export interface IChatUser {
	id: number;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	profile: IChatProfile | null;
}

export interface UpdateChatDto {
	name?: string;
	avatar?: string;
}

export interface IChatParticipant {
	id: number;
	chatId: number;
	userId: number;
	user: IChatUser;
}

export interface ILastMessage {
	id?: number;
	text: string | null;
	createdAt: string;
	senderId: number | string;
	sender?: { username: string | null } | null;
	messageImages?: { id: number; image: string }[];
	chat_app_message_readers?: { userId: number }[];
}

export interface IChat {
	id: number;
	name: string | null;
	isGroup: boolean;
	avatar: string | null;
	adminId?: number | null;
	createdAt?: string;
	updatedAt?: string;
	users: IChatParticipant[];
	messages?: ILastMessage[];
	lastMessage?: ILastMessage | null;
	_count?: {
        messages: number; 
    };
}

export type SocketCallback = (res: { status: string }) => void;

export interface MessageImage {
	id: number;
	image: string;
}

export interface CreateChatDto {
	name: string;
	userIds: number[];
	isGroup?: boolean;
}

export interface UpdateChatDto {
	name?: string;
}
