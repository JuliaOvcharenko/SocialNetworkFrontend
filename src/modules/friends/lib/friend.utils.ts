import { IFriendship, IUser } from "@modules/friends/api/friend.types";

export const getUserFromRequest = (item: IFriendship): IUser | null => {
    return item.fromUser ?? null;
};

export const getUserFromFriend = (
    item: IFriendship,
    currentUserId: string | null
): IUser | null => {
    if (!currentUserId) return item.fromUser ?? item.toUser ?? null;
    return String(item.from_user_id) === currentUserId
        ? (item.toUser ?? null)
        : (item.fromUser ?? null);
};