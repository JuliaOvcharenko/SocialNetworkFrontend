export interface IUser {
	id: string;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	email: string;
	profile: {
		id: string;
		avatar: string | null;
		pseudonym: string | null;
		userId: string;
	} | null;
}

export interface IProfile {
	id: string;
	avatar: string | null;
	pseudonym: string | null;
	userId: string;
	user?: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		username: string | null;
		email: string;
	};
}

export interface IFriendship {
	toProfileRel: any;
	from_profile: number;
	id: string;
	status: string;
	from_user_id: string;
	to_user_id: string;
	created_at: string;
	fromUser?: IUser;
	toUser?: IUser;
}

export interface IFriendsRequest extends IFriendship {}
export interface IProfileFriend extends IFriendship {}

export interface FriendsOverview {
	requests: IFriendship[];
	suggestions: IUser[];
	friends: IFriendship[];
}

export interface SendRequestPayload {
	targetUserId: number;
}

export interface AcceptActionParams {
	id: number;
	type?: string;
}

export interface DeleteActionParams {
	id: number;
	type?: string;
}
