import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@shared/socket/socket";
import { chatsApi } from "@modules/chats/api/chat.api";
import { messageApi } from "@modules/messages/api/message.api";
import { ILastMessage } from "../api/chat.types";

export const useSocketEvents = () => {
	const dispatch = useDispatch<any>();

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		const connect = async (): Promise<(() => void) | undefined> => {
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

				const handleNewMessage = ({
					chatId,
					message,
				}: {
					chatId: number;
					message: ILastMessage;
				}) => {
					dispatch(
						chatsApi.util.updateQueryData(
							"getPersonalChats",
							undefined,
							(draft) => {
								const chat = draft.find(
									(c) => Number(c.id) === Number(chatId),
								);

								if (chat) {
									chat.lastMessage = message;
									if (chat._count) chat._count.messages += 1;
								}
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

								if (chat) {
									chat.lastMessage = message;
									if (chat._count) chat._count.messages += 1;
								}
							},
						),
					);
				};

				socket.on("messagesRead", handleMessagesRead);
				socket.on("newMessage", handleNewMessage);

				return () => {
					socket.off("messagesRead", handleMessagesRead);
					socket.off("newMessage", handleNewMessage);
				};
			} catch (e) {
				console.error("useSocketEvents error:", e);
				return undefined;
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
