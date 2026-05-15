import { User } from "@modules/auth/api/api.types";

export interface IUser {
	id: number;
	name: string;
	surname: string;
	nickname: string;
	avatars: Array<{
		isActive: boolean;
		image: {
			normalImageURL: string;
		};
	}>;
	isOnline?: boolean;
}

export interface IFriendship {
	id: number;
	status: string;
	from_profile: number;
	to_profile: number;
	created_at: string;
}

export type FriendshipWithProfile = IFriendship & {
	fromProfileRel?: IUser;
	toProfileRel?: IUser;
};

export interface FriendsOverview {
	requests: FriendshipWithProfile[];
	suggestions: User[];
	friends: FriendshipWithProfile[];
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
