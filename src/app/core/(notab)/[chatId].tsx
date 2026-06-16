import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Image,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@shared/ui/header";
import { IMAGES } from "@shared/ui/images";
import { COLOURS } from "@shared/constants/colours";
import { Footer } from "@shared/ui/footer";
import {
	GroupDetailsModal,
	GroupDetailsData,
} from "@shared/ui/modals/group-details-modal";
import { SelectUsersModal } from "@shared/ui/modals/select-users-modal";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import * as ImagePicker from "expo-image-picker";
import { IMessage } from "@modules/messages/api/message.types";
import { useChat } from "@modules/messages/hooks/useChat";
import { useGetMessagesQuery } from "@modules/messages/api/message.api";
import { BASE_URL } from "@shared/config/api.config";
import { queryBaseHeaders } from "@shared/api/headers";
import {
	useGetChatByIdQuery,
	useUpdateChatMutation,
	useDeleteChatMutation,
	useLeaveChatMutation,
} from "@modules/chats/api/chat.api";
import { useGetAllFriendsQuery } from "@modules/friends/api/friend.api";
import { IUser } from "@modules/friends/api/friend.types";
import { MessageImage } from "@modules/chats/api/chat.types";

export function photoUri(url: string): string {
	if (!url) return "";
	if (url.includes("res.cloudinary.com")) {
		console.log("Cloudinary URL passed through:", url);
		return url;
	}
	if (url.startsWith("http"))
		return url.replace(/^https?:\/\/[^/]+/, BASE_URL);
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

function formatSeparatorDate(dateStr: string): string {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return "";
	const months = [
		"січня",
		"лютого",
		"березня",
		"квітня",
		"травня",
		"червня",
		"липня",
		"серпня",
		"вересня",
		"жовтня",
		"листопада",
		"грудня",
	];
	return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getInitials(
	firstName?: string | null,
	lastName?: string | null,
	username?: string | null,
): string {
	if (firstName || lastName)
		return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
	return (username?.[0] ?? "?").toUpperCase();
}

function getDisplayName(
	firstName?: string | null,
	lastName?: string | null,
	username?: string | null,
): string {
	const full = [firstName, lastName].filter(Boolean).join(" ").trim();
	return full || username || "Unknown";
}

function formatMessageTime(createdAt: string): string {
	return new Date(createdAt).toLocaleTimeString("uk-UA", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function getAutoAvatar(name: string): string {
	const i = name.trim();
	const onlyCapitalLetters = (str: string) => str.replace(/[^A-Z]+/g, "");
	if (i.length < 1) return "NG";
	if (i.split(" ").length > 1) {
		const n = i.toUpperCase().split(" ");
		return n[0][0] + n[1][0];
	}
	if (i.split("_").length > 1) {
		const n = i.toUpperCase().split("_");
		return n[0][0] + n[1][0];
	}
	if (onlyCapitalLetters(i).length > 1) {
		return onlyCapitalLetters(i).substring(0, 2);
	}
	return i[0].toUpperCase();
}

const AVATAR_COLORS_LIST = [
	COLOURS.Plum,
	"#457b9d",
	"#2a9d8f",
	"#e76f51",
	"#6a4c93",
];
const AVATAR_COLOR_CACHE: Record<string, string> = {};

function getAvatarColor(name: string): string {
	if (!AVATAR_COLOR_CACHE[name]) {
		AVATAR_COLOR_CACHE[name] =
			AVATAR_COLORS_LIST[name.length % AVATAR_COLORS_LIST.length];
	}
	return AVATAR_COLOR_CACHE[name];
}

export default function ChatScreen() {
	const router = useRouter();
	const { id, fromTab } = useLocalSearchParams<{
		id: string;
		fromTab?: string;
	}>();
	const chatId = Number(id);
	const activeTab =
		(fromTab as "contacts" | "messages" | "groupChats") ?? "groupChats";

	const [message, setMessage] = useState("");
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);
	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
	const [groupPhotoUri, setGroupPhotoUri] = useState<string | null>(null);
	const flatListRef = useRef<FlatList>(null);

	const { data: initialMessages = [], isLoading } =
		useGetMessagesQuery(chatId);
	const { data: chatDetails, isLoading: isChatLoading } =
		useGetChatByIdQuery(chatId);
	const { data: friendsResponse } = useGetAllFriendsQuery();

	const [updateChat] = useUpdateChatMutation();
	const [deleteChat] = useDeleteChatMutation();
	const [leaveChat] = useLeaveChatMutation();
	const { sendMessage, addUsers, removeUser, isConnected, markAsRead } =
		useChat(chatId, currentUserId);

	useEffect(() => {
		if (!isConnected) return;
		markAsRead();
	}, [isConnected, markAsRead]);

	console.log("RAW MESSAGES:", JSON.stringify(initialMessages[0], null, 2));

	const allMessages = initialMessages as IMessage[];

	const processedMessages = React.useMemo(() => {
		if (!allMessages.length || !currentUserId) return [];

		const result: any[] = [];
		let lastDateString = "";
		let unreadDividerInserted = false;

		const firstUnreadIndex = allMessages.findIndex((msg) => {
			const isMe = Number(msg.senderId) === currentUserId;
			if (isMe) return false;
			const isRead = msg.chat_app_message_readers?.some(
				(r) => Number(r.userId) === currentUserId,
			);
			return !isRead;
		});

		allMessages.forEach((msg, index) => {
			const msgDate = new Date(msg.createdAt);
			const currentDateString = msgDate.toDateString();

			if (currentDateString !== lastDateString) {
				result.push({
					type: "date_separator",
					id: `date-${currentDateString}`,
					date: msg.createdAt,
				});
				lastDateString = currentDateString;
			}

			if (!unreadDividerInserted && index === firstUnreadIndex) {
				result.push({
					type: "unread_divider",
					id: "unread_divider",
				});
				unreadDividerInserted = true;
			}

			result.push({ ...msg, type: "message" });
		});

		return result;
	}, [allMessages, currentUserId]);

	useEffect(() => {
		getCurrentUserId().then((uid) => setCurrentUserId(Number(uid)));
	}, []);

	useEffect(() => {
		if (allMessages.length > 0) {
			setTimeout(
				() => flatListRef.current?.scrollToEnd({ animated: true }),
				100,
			);
		}
	}, [allMessages.length]);

	const isAdmin =
		chatDetails?.adminId != null &&
		Number(chatDetails.adminId) === currentUserId;
	const isGroup = chatDetails?.isGroup ?? false;

	const friendsList: IUser[] = React.useMemo(() => {
		if (!friendsResponse || !currentUserId) return [];
		return friendsResponse
			.map((f) => {
				const isFromMe =
					String(f.from_user_id) === String(currentUserId);
				return isFromMe ? f.toUser : f.fromUser;
			})
			.filter((u): u is IUser => u != null);
	}, [friendsResponse, currentUserId]);

	const participantIds = new Set(
		chatDetails?.users?.map((u) => String(u.userId)) ?? [],
	);
	const nonParticipants = friendsList.filter(
		(u) => !participantIds.has(String(u.id)),
	);

	const handleSend = useCallback(() => {
		if (!message.trim()) return;
		sendMessage(message.trim());
		setMessage("");
	}, [message, sendMessage]);

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.8,
			allowsMultipleSelection: true,
			selectionLimit: 7,
		});

		if (!result.canceled && result.assets.length > 0) {
			if (result.assets.length === 7) {
				Alert.alert("Максимум", "Можна відправити не більше 7 фото");
			}
			try {
				const headers = new Headers();
				await queryBaseHeaders(headers);

				const urls = await Promise.all(
					result.assets.map(async (asset) => {
						const formData = new FormData();
						formData.append("file", {
							uri: asset.uri,
							name: "image.jpg",
							type: "image/jpeg",
						} as unknown as Blob);
						const response = await fetch(
							`${BASE_URL}/api/messages/upload`,
							{ method: "POST", body: formData, headers },
						);
						const { url } = (await response.json()) as {
							url: string;
						};
						return url;
					}),
				);

				sendMessage("", urls);
			} catch (e) {
				console.error("Upload error:", e);
			}
		}
	};

	const handlePickGroupPhoto = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.8,
		});
		if (!result.canceled && result.assets[0]) {
			setGroupPhotoUri(result.assets[0].uri);
		}
	};

	const handleEditGroup = async (data: GroupDetailsData) => {
		try {
			const formData = new FormData();
			if (data.name) formData.append("name", data.name);
			if (groupPhotoUri) {
				formData.append("avatar", {
					uri: groupPhotoUri,
					name: "avatar.jpg",
					type: "image/jpeg",
				} as unknown as Blob);
			}
			await updateChat({ id: chatId, data: formData }).unwrap();
			setIsEditModalOpen(false);
			setGroupPhotoUri(null);
		} catch {
			Alert.alert("Помилка", "Не вдалося оновити групу");
		}
	};

	const handleRemoveUser = (userId: number) => {
		Alert.alert("Видалити учасника", "Ви впевнені?", [
			{ text: "Скасувати", style: "cancel" },
			{
				text: "Видалити",
				style: "destructive",
				onPress: () =>
					removeUser(userId, (res: { status: string }) => {
						if (res.status !== "ok")
							Alert.alert(
								"Помилка",
								"Не вдалося видалити учасника",
							);
					}),
			},
		]);
	};

	const handleLeaveChat = () => {
		Alert.alert("Покинути групу", "Ви впевнені?", [
			{ text: "Скасувати", style: "cancel" },
			{
				text: "Покинути",
				style: "destructive",
				onPress: async () => {
					try {
						await leaveChat({ chatId }).unwrap();
						router.push(`/core/chats?tab=groupChats`);
					} catch {
						Alert.alert("Помилка", "Не вдалося покинути групу");
					}
				},
			},
		]);
	};

	const handleDeleteChat = () => {
		Alert.alert("Видалити чат", "Це незворотна дія. Продовжити?", [
			{ text: "Скасувати", style: "cancel" },
			{
				text: "Видалити",
				style: "destructive",
				onPress: async () => {
					try {
						await deleteChat(chatId).unwrap();
						router.push(
							`/core/chats?tab=${isGroup ? "groupChats" : "messages"}`,
						);
					} catch {
						Alert.alert("Помилка", "Не вдалося видалити чат");
					}
				},
			},
		]);
	};

	const chatHeaderInfo = (() => {
		if (chatDetails?.isGroup) {
			const name = chatDetails.name ?? `Чат #${id}`;
			return {
				name,
				initials: getAutoAvatar(name),
				avatarUrl:
					chatDetails.avatar &&
					chatDetails.avatar !== "default-group-avatar.png"
						? photoUri(chatDetails.avatar)
						: null,
			};
		}
		const otherUser =
			chatDetails?.users?.find(
				(u) => Number(u.userId) !== Number(currentUserId),
			)?.user ?? chatDetails?.users?.[0]?.user;
		const name = otherUser
			? getDisplayName(
					otherUser.firstName,
					otherUser.lastName,
					otherUser.username,
				)
			: `Чат #${id}`;
		return {
			name,
			initials: otherUser
				? getInitials(
						otherUser.firstName,
						otherUser.lastName,
						otherUser.username,
					)
				: "??",
			avatarUrl: otherUser?.profile?.avatar
				? photoUri(otherUser.profile.avatar)
				: null,
		};
	})();

	const tabs = [
		{
			key: "contacts" as const,
			label: "Контакти",
			icon: <IMAGES.friendsButton style={styles.iconContacts} />,
		},
		{
			key: "messages" as const,
			label: "Повідомлення",
			icon: <IMAGES.chatButton style={styles.icon} />,
		},
		{
			key: "groupChats" as const,
			label: "Групові чати",
			icon: <IMAGES.chatButton style={styles.icon} />,
		},
	];

	const renderItem = ({ item }: { item: any }) => {
		if (item.type === "date_separator") {
			console.log("RENDER ITEM:", item.id, "images:", JSON.stringify(item.messageImages));
			return (
				<View style={styles.dateSeparatorContainer}>
					<View style={styles.dateSeparatorPill}>
						<Text style={styles.dateSeparatorText}>
							{formatSeparatorDate(item.date)}
						</Text>
					</View>
				</View>
			);
		}

		if (item.type === "unread_divider") {
			return (
				<View style={styles.newMessagesDividerContainer}>
					<View style={styles.newMessagesLine} />
					<Text style={styles.newMessagesText}>
						Нові повідомлення
					</Text>
					<View style={styles.newMessagesLine} />
				</View>
			);
		}

		const isMe =
			currentUserId !== null &&
			item.senderId !== null &&
			Number(item.senderId) === Number(currentUserId);
		const sender = item.sender;
		const senderName = getDisplayName(
			sender?.firstName,
			sender?.lastName,
			sender?.username,
		);
		const initials = getInitials(
			sender?.firstName,
			sender?.lastName,
			sender?.username,
		);
		const avatarUrl = sender?.profile?.avatar
			? photoUri(sender.profile.avatar)
			: null;
		const isRead = (item.chat_app_message_readers?.length ?? 0) > 0;
		const messageImages =
			(item as IMessage & { messageImages?: MessageImage[] })
				.messageImages ?? [];

		return (
			<View
				style={[
					styles.messageWrapper,
					isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
				]}
			>
				{!isMe &&
					(avatarUrl ? (
						<Image
							source={{ uri: avatarUrl }}
							style={styles.avatarSmall}
						/>
					) : (
						<View
							style={[
								styles.avatarSmall,
								styles.avatarFallback,
								{ backgroundColor: getAvatarColor(senderName) },
							]}
						>
							<Text style={styles.avatarSmallText}>
								{initials}
							</Text>
						</View>
					))}

				<View style={styles.col}>
					<View
						style={[
							styles.bubble,
							isMe ? styles.bubbleMe : styles.bubbleOther,
						]}
					>
						{!isMe && (
							<Text style={styles.senderNameInside}>
								{senderName}
							</Text>
						)}

						{messageImages.length > 0 && (
							<View style={styles.imageGrid}>
								{messageImages.slice(0, 7).map((img, index) => {
									const count = messageImages.length;
									const isAloneInRow =
										(count === 3 && index === 2) ||
										(count === 5 && index === 4) ||
										(count === 6 && index === 5) ||
										count === 1;
									return (
										<Image
											key={img.id}
											source={{
												uri: photoUri(img.image),
											}}
											style={[
												styles.imageCell,
												count === 1 &&
													styles.imageSingle,
												count >= 2 &&
													!isAloneInRow &&
													(index < 2
														? styles.imageHalf
														: index < 5
															? styles.imageThird
															: styles.imageHalf),
												isAloneInRow &&
													count > 1 &&
													styles.imageFullRow,
											]}
											resizeMode="cover"
											onError={(e) =>
												console.log(
													"IMAGE LOAD ERROR:",
													img.image,
													JSON.stringify(
														e.nativeEvent,
													),
												)
											}
											onLoad={() =>
												console.log(
													"IMAGE LOADED OK:",
													img.image,
												)
											}
										/>
									);
								})}
							</View>
						)}

						{item.text ? (
							<View
								style={[
									styles.bubbleContentRow,
									isMe
										? styles.bubbleContentRowMe
										: styles.bubbleContentRowOther,
								]}
							>
								<Text
									style={[
										styles.bubbleText,
										isMe && styles.bubbleTextMe,
									]}
								>
									{item.text}
								</Text>
								<View style={styles.bubbleMetaInline}>
									<Text
										style={[
											styles.bubbleTime,
											isMe && styles.bubbleTimeMe,
										]}
									>
										{formatMessageTime(item.createdAt)}
									</Text>
									{isMe && (
										<Ionicons
											name={
												isRead
													? "checkmark-done"
													: "checkmark"
											}
											size={14}
											color={
												isRead
													? COLOURS.darkBlue
													: "#8A90A8"
											}
											style={{ marginLeft: 4 }}
										/>
									)}
								</View>
							</View>
						) : (
							<View style={styles.bubbleMetaInline}>
								<Text
									style={[
										styles.bubbleTime,
										isMe && styles.bubbleTimeMe,
									]}
								>
									{formatMessageTime(item.createdAt)}
								</Text>
								{isMe && (
									<Ionicons
										name={
											isRead
												? "checkmark-done"
												: "checkmark"
										}
										size={14}
										color={
											isRead
												? COLOURS.darkBlue
												: "#8A90A8"
										}
										style={{ marginLeft: 4 }}
									/>
								)}
							</View>
						)}
					</View>
				</View>
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={90}
		>
			<Header
				showCreateButton
				showLogoutButton
				onCreatePress={() => {}}
			/>

			<View style={styles.tabsContainer}>
				{tabs.map((tab) => (
					<TouchableOpacity
						key={tab.key}
						style={styles.tab}
						onPress={() =>
							router.push(`/core/chats?tab=${tab.key}`)
						}
						activeOpacity={0.7}
					>
						<View style={styles.iconWrapper}>{tab.icon}</View>
						<Text style={styles.tabTextActive}>{tab.label}</Text>
						{activeTab === tab.key && (
							<View style={styles.indicator} />
						)}
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.chatHeader}>
				<TouchableOpacity
					onPress={() =>
						router.push(
							`/core/chats?tab=${fromTab ?? "groupChats"}`,
						)
					}
					style={styles.backBtn}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color={COLOURS.Blue50}
					/>
				</TouchableOpacity>
				{chatHeaderInfo.avatarUrl ? (
					<Image
						source={{ uri: chatHeaderInfo.avatarUrl }}
						style={styles.headerAvatarImage}
					/>
				) : (
					<View style={styles.headerAvatar}>
						<Text style={styles.headerAvatarText}>
							{chatHeaderInfo.initials}
						</Text>
					</View>
				)}
				<View style={styles.headerInfo}>
					<Text style={styles.headerName}>{chatHeaderInfo.name}</Text>
					<Text style={styles.headerSub}>
						{isGroup
							? `${(chatDetails?.users?.length ?? 0) + 1} учасників`
							: isConnected
								? "онлайн"
								: "з'єднання..."}
					</Text>
				</View>
				<TouchableOpacity
					style={styles.moreBtn}
					onPress={() => setIsActionModalOpen(true)}
				>
					<Ionicons
						name="ellipsis-vertical"
						size={20}
						color={COLOURS.Blue50}
					/>
				</TouchableOpacity>
			</View>

			{isLoading || isChatLoading ? (
				<View style={styles.loader}>
					<ActivityIndicator size="large" color={COLOURS.Plum} />
				</View>
			) : (
				<FlatList
					ref={flatListRef}
					data={processedMessages}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					contentContainerStyle={styles.messagesList}
					initialNumToRender={20}
					maxToRenderPerBatch={10}
					windowSize={5}
					removeClippedSubviews={true}
					onContentSizeChange={() =>
						flatListRef.current?.scrollToEnd({ animated: false })
					}
				/>
			)}

			<View style={styles.inputBar}>
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					placeholder="Повідомлення"
					placeholderTextColor={COLOURS.Blue50}
					onSubmitEditing={handleSend}
					returnKeyType="send"
				/>
				<TouchableOpacity
					style={styles.attachBtn}
					onPress={handlePickImage}
				>
					<IMAGES.GalleryButton />
				</TouchableOpacity>
				<TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
					<IMAGES.HandButton />
				</TouchableOpacity>
			</View>

			<Footer />

			{isActionModalOpen && (
				<>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.modalOverlay}
						onPress={() => setIsActionModalOpen(false)}
					/>
					<View style={styles.dropdownModal}>
						<View style={styles.dropdownDots}>
							<TouchableOpacity
								style={styles.moreBtn}
								onPress={() => setIsActionModalOpen(false)}
							>
								<Ionicons
									name="ellipsis-vertical"
									size={20}
									color={COLOURS.Blue50}
								/>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={styles.dropdownItem}
							activeOpacity={0.7}
						>
							<IMAGES.GalleryButton
								style={{ width: 17, height: 17 }}
							/>
							<Text style={styles.dropdownText}>Медіа</Text>
						</TouchableOpacity>

						{isGroup && isAdmin && (
							<TouchableOpacity
								style={styles.dropdownItem}
								activeOpacity={0.7}
								onPress={() => {
									setIsActionModalOpen(false);
									setIsEditModalOpen(true);
								}}
							>
								<IMAGES.PenButton
									style={{ width: 16, height: 16 }}
								/>
								<Text style={styles.dropdownText}>
									Редагувати групу
								</Text>
							</TouchableOpacity>
						)}

						<View style={styles.dropdownDivider} />

						{isGroup && !isAdmin && (
							<TouchableOpacity
								style={styles.dropdownItem}
								activeOpacity={0.7}
								onPress={() => {
									setIsActionModalOpen(false);
									handleLeaveChat();
								}}
							>
								<Ionicons
									name="log-out-outline"
									size={19}
									color={COLOURS.darkBlue}
								/>
								<Text style={styles.dropdownText}>
									Покинути групу
								</Text>
							</TouchableOpacity>
						)}

						{isAdmin && (
							<TouchableOpacity
								style={styles.dropdownItem}
								activeOpacity={0.7}
								onPress={() => {
									setIsActionModalOpen(false);
									handleDeleteChat();
								}}
							>
								<Ionicons
									name="trash-outline"
									size={17}
									color="#e76f51"
								/>
								<Text
									style={[
										styles.dropdownText,
										{ color: "#e76f51" },
									]}
								>
									Видалити чат
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</>
			)}

			<GroupDetailsModal
				visible={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setGroupPhotoUri(null);
				}}
				selectedUsers={
					(chatDetails?.users?.map((u) => ({
						...u.user,
						id: String(u.userId),
						email: "",
					})) as IUser[]) ?? []
				}
				onRemoveUser={(userId) => handleRemoveUser(Number(userId))}
				onAddMore={() => setIsAddUsersModalOpen(true)}
				onSubmit={handleEditGroup}
				title="Редагування групи"
				buttonText="Зберегти зміни"
				initialName={chatDetails?.name ?? ""}
				groupPhotoUri={
					groupPhotoUri ??
					(chatDetails?.avatar ? photoUri(chatDetails.avatar) : null)
				}
				onAddPhoto={handlePickGroupPhoto}
				onReplacePhoto={handlePickGroupPhoto}
			/>

			<SelectUsersModal
				visible={isAddUsersModalOpen}
				onClose={() => setIsAddUsersModalOpen(false)}
				users={nonParticipants}
				onSave={(ids) => {
					setIsAddUsersModalOpen(false);
					addUsers(ids.map(Number), (res: { status: string }) => {
						if (res.status !== "ok")
							Alert.alert(
								"Помилка",
								"Не вдалося додати учасників",
							);
					});
				}}
				title="Додати учасників"
				buttonText="Додати"
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLOURS.white },
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },
	tabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: COLOURS.Blue20,
		paddingHorizontal: 8,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		position: "relative",
		gap: 4,
	},
	iconWrapper: { position: "relative" },
	icon: { width: 16, height: 16 },
	iconContacts: { width: 22, height: 16 },
	tabTextActive: { color: COLOURS.darkBlue, fontWeight: "600" },
	indicator: {
		position: "absolute",
		bottom: 0,
		left: "50%",
		transform: [{ translateX: -30 }],
		width: 60,
		height: 2,
		backgroundColor: COLOURS.Plum,
	},
	chatHeader: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLOURS.white,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderColor: COLOURS.Blue20,
		gap: 10,
	},
	backBtn: { padding: 4 },
	headerAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
	},
	headerAvatarImage: { width: 40, height: 40, borderRadius: 20 },
	headerAvatarText: { color: COLOURS.white, fontWeight: "700", fontSize: 14 },
	headerInfo: { flex: 1 },
	headerName: { fontSize: 15, fontWeight: "600", color: COLOURS.darkBlue },
	headerSub: { fontSize: 12, color: COLOURS.Blue50, marginTop: 1 },
	moreBtn: { padding: 4 },
	messagesList: { padding: 16, gap: 12 },

	messageWrapper: {
		flexDirection: "row",
		marginBottom: 12,
		alignItems: "center",
		gap: 8,
	},
	messageWrapperMe: { justifyContent: "flex-end" },
	messageWrapperOther: { justifyContent: "flex-start" },

	avatarSmall: { width: 46, height: 46, borderRadius: 23 },
	avatarFallback: { alignItems: "center", justifyContent: "center" },
	avatarSmallText: { fontSize: 13, fontWeight: "600", color: COLOURS.white },

	col: {
		maxWidth: "75%",
		flexShrink: 1,
	},

	inputBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLOURS.white,
		borderTopWidth: 1,
		borderTopColor: COLOURS.Blue20,
		gap: 12,
	},
	input: {
		flex: 1,
		height: 45,
		borderWidth: 1,
		borderColor: COLOURS.Blue20,
		borderRadius: 10,
		paddingHorizontal: 18,
		fontSize: 16,
		color: COLOURS.darkBlue,
	},
	attachBtn: {
		width: 40,
		height: 40,
		borderRadius: 25,
		borderWidth: 1.5,
		borderColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLOURS.white,
	},
	sendBtn: {
		width: 40,
		height: 40,
		borderRadius: 25,
		backgroundColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
	},
	modalOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		zIndex: 20,
	},
	dropdownModal: {
		position: "absolute",
		top: 128,
		right: 8,
		width: 215,
		backgroundColor: COLOURS.Plum50,
		borderRadius: 10,
		paddingTop: 20,
		paddingBottom: 2,
		zIndex: 30,
	},
	dropdownDots: { position: "absolute", top: 4, right: 4 },
	dropdownItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	dropdownText: { fontSize: 14, fontWeight: "600", color: COLOURS.darkBlue },
	dropdownDivider: {
		height: 1,
		backgroundColor: COLOURS.Blue20,
		marginHorizontal: 10,
	},
	imageGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 2,
		borderRadius: 10,
		overflow: "hidden",
		maxWidth: 240,
		marginBottom: 4,
	},
	imageCell: { height: 120, borderRadius: 4 },
	imageSingle: { width: 240, height: 220 },
	imageHalf: { width: 119 },
	imageThird: { width: 78 },
	imageFullRow: { width: 240 },

	senderNameInside: {
		fontSize: 10,
		fontWeight: "400",
		fontFamily: "Wals-Regular",
		color: COLOURS.Plum,
		marginBottom: 8,
	},

	bubble: {
		padding: 10,
	},
	bubbleMe: {
		backgroundColor: COLOURS.Blue20,
		borderRadius: 8,
	},
	bubbleOther: {
		backgroundColor: COLOURS.white,
		borderWidth: 1,
		borderColor: COLOURS.Plum50,
		borderRadius: 8,
	},

	bubbleContentRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		marginTop: 2,
		flexShrink: 1,
		flexWrap: "wrap",
	},

	bubbleContentRowMe: {
		justifyContent: "flex-start",
	},

	bubbleContentRowOther: {
		minWidth: 100,

		justifyContent: "space-between",
		width: "100%",
	},
	bubbleText: {
		fontSize: 14,
		fontWeight: "400",
		fontFamily: "Wals-Regular",
		color: COLOURS.darkBlue,
		lineHeight: 20,
		flexShrink: 1,
		marginRight: 16,
	},
	bubbleTextMe: { color: COLOURS.darkBlue },

	bubbleMetaInline: {
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		top: 3,
	},
	bubbleTime: { fontSize: 11, color: COLOURS.Blue50 },
	bubbleTimeMe: { color: COLOURS.Blue50 },

	dateSeparatorContainer: {
		alignItems: "center",
		marginVertical: 12,
	},
	dateSeparatorPill: {
		backgroundColor: COLOURS.Plum50,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
	},
	dateSeparatorText: {
		fontSize: 16,
		fontWeight: "400",
		fontFamily: "Wals-Regular",
		color: COLOURS.Blue50,
	},
	newMessagesDividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 4,
	},
	newMessagesLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLOURS.Blue20,
	},
	newMessagesText: {
		marginHorizontal: 10,
		fontSize: 16,
		fontWeight: "400",
		fontFamily: "Wals-Regular",
		color: COLOURS.Blue50,
	},
});
