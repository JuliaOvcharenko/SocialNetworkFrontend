export interface IMessageSender {
	id: number;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	profile: {
		id: number;
		avatar: string | null;
	} | null;
}

export interface IMessage {
	id: number;
	text: string | null;
	createdAt: string;
	chatId: number;
	senderId: number | null;
	sender: IMessageSender | null;
	messageImages: IMessageImage[];
	chat_app_message_readers: { userId: number }[];
}

export interface IMessageImage {
	id: number;
	image: string;
	messageId: number;
}

export interface SendMessageDTO {
    text: string | null;
    chatId: number;
    imageUri?: string | string[] | null;
}