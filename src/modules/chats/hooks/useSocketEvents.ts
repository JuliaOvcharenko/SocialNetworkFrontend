import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@shared/socket/socket";
import { chatsApi } from "@modules/chats/api/chat.api";
import { messageApi } from "@modules/messages/api/message.api";

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

				const handleNewMessage = () => {
					dispatch(chatsApi.util.invalidateTags(["Chats"]));
				};

				socket.on("messagesRead", handleMessagesRead);
				socket.on("newMessage", handleNewMessage);

				return () => {
					socket.off("messagesRead", handleMessagesRead);
					socket.off("newMessage", handleNewMessage);
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
