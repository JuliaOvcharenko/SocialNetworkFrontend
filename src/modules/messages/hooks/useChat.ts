import { useEffect, useRef, useState, useCallback } from "react";
import { initSocket } from "@shared/socket/socket";
import { IMessage } from "../api/message.types";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { messageApi } from "../api/message.api";
import { chatsApi } from "@modules/chats/api/chat.api";

export const useChat = (chatId: number, currentUserId?: number | null) => {
	const dispatch = useDispatch<any>();
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		initSocket().then((socket) => {
			socketRef.current = socket;

			const onNewMessage = (message: IMessage) => {
				console.log("NEW MESSAGE:", JSON.stringify(message, null, 2));
				console.log(
					"onNewMessage received",
					message.id,
					"chatId",
					message.chatId,
				);
				dispatch(
					messageApi.util.updateQueryData(
						"getMessages",
						chatId,
						(draft) => {
							if (
								!draft.some(
									(m) => String(m.id) === String(message.id),
								)
							) {
								draft.push(message);
							}
						},
					),
				);

				const lastMsg = {
					id: message.id,
					text: message.text,
					createdAt: message.createdAt,
					senderId: message.senderId,
					sender: message.sender
						? { username: message.sender.username }
						: null,
					chat_app_message_readers: [],
					messageImages: message.messageImages ?? [],
				};
				const isFromOther =
					Number(message.senderId) !== Number(currentUserId);

				for (const endpoint of [
					"getPersonalChats",
					"getGroupChats",
				] as const) {
					dispatch(
						chatsApi.util.updateQueryData(
							endpoint,
							undefined,
							(draft) => {
								const chat = draft.find(
									(c) =>
										Number(c.id) === Number(message.chatId),
								);
								if (!chat) return;
								(chat as any).messages = [lastMsg];
								if (isFromOther && chat._count)
									chat._count.messages += 1;
							},
						),
					);
				}
			};

			const onMessagesRead = ({
				chatId: readChatId,
			}: {
				chatId: number;
			}) => {
				if (Number(readChatId) === chatId) {
					dispatch(
						messageApi.util.updateQueryData(
							"getMessages",
							chatId,
							(draft) => {
								draft.forEach((msg) => {
									if (
										Number(msg.senderId) ===
											Number(currentUserId) &&
										!msg.chat_app_message_readers?.length
									) {
										msg.chat_app_message_readers = [
											{ userId: -1 },
										];
									}
								});
							},
						),
					);
				}

				for (const endpoint of [
					"getPersonalChats",
					"getGroupChats",
				] as const) {
					dispatch(
						chatsApi.util.updateQueryData(
							endpoint,
							undefined,
							(draft) => {
								const chat = draft.find(
									(c) => Number(c.id) === Number(readChatId),
								);
								if (chat?._count) chat._count.messages = 0;
							},
						),
					);
				}
			};

			const onConnect = () => {
				setIsConnected(true);
				socket.emit("joinChat", { chatId }, (ack: any) => {
					console.log("joinChat ack:", ack);
				});
			};

			const onDisconnect = () => setIsConnected(false);

			socket.on("newMessage", onNewMessage);
			socket.on("messagesRead", onMessagesRead);
			socket.on("connect", onConnect);
			socket.on("disconnect", onDisconnect);

			if (socket.connected) onConnect();

			cleanup = () => {
				socket.off("newMessage", onNewMessage);
				socket.off("messagesRead", onMessagesRead);
				socket.off("connect", onConnect);
				socket.off("disconnect", onDisconnect);
				socket.emit("leaveChat", { chatId });
			};
		});

		return () => cleanup?.();
	}, [chatId, currentUserId]);

	const sendMessage = useCallback(
		(text: string, imageUri?: string | string[]) => {
			const socket = socketRef.current;
			if (!socket || (!text.trim() && !imageUri)) return;
			socket.emit("sendMessage", { text, chatId, imageUri });
		},
		[chatId],
	);

	const addUsers = useCallback(
		(userIds: number[], ack?: (res: any) => void) => {
			socketRef.current?.emit("addUsersToChat", { chatId, userIds }, ack);
		},
		[chatId],
	);

	const removeUser = useCallback(
		(targetUserId: number, ack?: (res: any) => void) => {
			socketRef.current?.emit(
				"removeUserFromChat",
				{ chatId, targetUserId },
				ack,
			);
		},
		[chatId],
	);

	const markAsRead = useCallback(() => {
		socketRef.current?.emit("mark_read", { chatId });
	}, [chatId]);

	return { sendMessage, addUsers, removeUser, isConnected, markAsRead };
};
