import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@shared/socket/socket";
import { chatsApi } from "@modules/chats/api/chat.api";
import { friendsApi } from "@modules/friends/api/friend.api";
import { postApi } from "@modules/post/api/post.api";

export const useSocketEvents = () => {
	const dispatch = useDispatch<any>();

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		const connect = async () => {
			try {
				const socket = await initSocket();

				const handleMessagesRead = ({ chatId }: { chatId: number }) => {
					dispatch(
						chatsApi.util.updateQueryData(
							"getPersonalChats",
							undefined,
							(draft) => {
								const chat = draft.find(
									(c) => Number(c.id) === Number(chatId),
								);
								if (chat?._count) chat._count.messages = 0;
							},
						),
					);
					dispatch(
						chatsApi.util.updateQueryData(
							"getGroupChats",
							undefined,
							(draft) => {
								const chat = draft.find(
									(c) => Number(c.id) === Number(chatId),
								);
								if (chat?._count) chat._count.messages = 0;
							},
						),
					);
				};

				const handleUserOnline = ({ userId }: { userId: number }) => {
					console.log(`User ${userId} went online!`);
					dispatch(friendsApi.util.invalidateTags(["Friends"]));
					dispatch(postApi.util.invalidateTags(["Post"]));
					dispatch(chatsApi.util.invalidateTags(["Chats"]));
				};

				const handleUserOffline = ({ userId }: { userId: number }) => {
					console.log(`User ${userId} went offline!`);
					dispatch(friendsApi.util.invalidateTags(["Friends"]));
					dispatch(postApi.util.invalidateTags(["Post"]));
					dispatch(chatsApi.util.invalidateTags(["Chats"]));
				};

				socket.on("messagesRead", handleMessagesRead);
				socket.on("user_online", handleUserOnline);
				socket.on("user_offline", handleUserOffline);

				return () => {
					socket.off("messagesRead", handleMessagesRead);
					socket.off("user_online", handleUserOnline);
					socket.off("user_offline", handleUserOffline);
				};
			} catch (e) {
				console.error("useSocketEvents error:", e);
			}
		};

		connect().then((fn) => {
			cleanup = fn;
		});
		return () => {
			cleanup?.();
		};
	}, []);
};
