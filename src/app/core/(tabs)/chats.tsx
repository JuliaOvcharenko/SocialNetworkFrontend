import { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Image,
	Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { IMAGES } from "../../../shared/ui/images";
import { SelectUsersModal } from "@shared/ui/modals/select-users-modal";
import {
	GroupDetailsModal,
	GroupDetailsData,
} from "@shared/ui/modals/group-details-modal";
import { useGetAllFriendsQuery } from "@modules/friends/api/friend.api";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import { IUser } from "@modules/friends/api/friend.types";
import { SearchInput } from "@shared/ui/searchInput/searchInput";
import { IChat } from "@modules/chats/api/chat.types";
import {
	useCreateChatMutation,
	useGetGroupChatsQuery,
	useGetPersonalChatsQuery,
} from "@modules/chats/api/chat.api";
import { BASE_URL } from "@shared/config/api.config";
import { useSocketEvents } from "@modules/chats/hooks/useSocketEvents";

function formatTime(dateStr: string): string {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return "";
	const h = String(d.getHours()).padStart(2, "0");
	const m = String(d.getMinutes()).padStart(2, "0");
	return `${h}:${m}`;
}

function formatDate(dateStr: string): string {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return "";
	return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

function photoUri(url: string): string {
	if (!url) return "";
	if (url.startsWith("http")) {
		return url.replace(/^https?:\/\/[^/]+/, BASE_URL);
	}
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

function Avatar({
	size = 52,
	uri,
	initials,
	color,
}: {
	size?: number;
	uri?: string;
	initials?: string;
	color?: string;
}) {
	if (uri) {
		return (
			<Image
				source={{ uri }}
				style={{ width: size, height: size, borderRadius: size / 2 }}
			/>
		);
	}
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: color ?? COLOURS.Plum,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{initials ? (
				<Text
					style={{
						color: COLOURS.white,
						fontWeight: "700",
						fontSize: size * 0.3,
					}}
				>
					{initials}
				</Text>
			) : null}
		</View>
	);
}

const AVATAR_COLORS = [
	COLOURS.Plum,
	"#457b9d",
	"#2a9d8f",
	"#e76f51",
	"#6a4c93",
];
function getAvatarColor(name: string) {
	return AVATAR_COLORS[name.length % AVATAR_COLORS.length];
}

function getInitials(
	firstName?: string | null,
	lastName?: string | null,
	username?: string | null,
): string {
	if (firstName || lastName) {
		return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
	}
	return (username?.[0] ?? "?").toUpperCase();
}

function getAutoAvatar(name: string): string {
	const i = name.trim();
	function onlyCapitalLetters(str: string) {
		return str.replace(/[^A-Z]+/g, "");
	}
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

function getDisplayName(
	firstName?: string | null,
	lastName?: string | null,
	username?: string | null,
): string {
	const full = [firstName, lastName].filter(Boolean).join(" ").trim();
	return full || username || "Чат";
}

function ContactsTab({
	users,
	isLoading,
	onContactPress,
}: {
	users: IUser[];
	isLoading: boolean;
	onContactPress: (user: IUser) => void;
}) {
	const [search, setSearch] = useState("");
	const filtered = useMemo((): IUser[] => {
		if (!search.trim()) return users;
		const q = search.toLowerCase();
		return users.filter(
			(u) =>
				u.firstName?.toLowerCase().includes(q) ||
				u.lastName?.toLowerCase().includes(q) ||
				u.username?.toLowerCase().includes(q),
		);
	}, [search, users]);

	if (isLoading)
		return (
			<View style={[styles.panel, { padding: 32, alignItems: "center" }]}>
				<ActivityIndicator size="large" color={COLOURS.Plum} />
			</View>
		);

	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.friendsButton
					style={{ width: 22, height: 16 }}
					tintColor="#8a90a8"
				/>
				<Text style={styles.panelTitle}>Контакти</Text>
			</View>
			<View style={styles.panelHeaderSearch}>
				<SearchInput
					value={search}
					onChangeText={setSearch}
					placeholder="Пошук"
					style={{ width: 370 }}
				/>
			</View>
			{filtered.map((user) => {
				const name = getDisplayName(
					user.firstName,
					user.lastName,
					user.username,
				);
				const initials = getInitials(
					user.firstName,
					user.lastName,
					user.username,
				);
				const avatarUri = user.profile?.avatar
					? photoUri(user.profile.avatar)
					: undefined;
				return (
					<TouchableOpacity
						key={user.id}
						style={styles.contactRow}
						activeOpacity={0.7}
						onPress={() => onContactPress(user)}
					>
						<Avatar
							uri={avatarUri}
							initials={initials}
							color={getAvatarColor(name)}
						/>
						<Text style={styles.contactName}>{name}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

function MessagesTab({ currentUserId }: { currentUserId: number | null }) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const { data: personalChats = [], isLoading } = useGetPersonalChatsQuery();

	const filtered = useMemo((): IChat[] => {
		if (!search.trim()) return personalChats as IChat[];
		const q = search.toLowerCase();
		return (personalChats as IChat[]).filter((c) => {
			const other =
				c.users?.find(
					(u) => String(u.user?.id) !== String(currentUserId),
				)?.user ?? c.users?.[0]?.user;
			const name = getDisplayName(
				other?.firstName,
				other?.lastName,
				other?.username,
			);
			return name.toLowerCase().includes(q);
		});
	}, [search, personalChats, currentUserId]);

	if (isLoading)
		return (
			<View style={[styles.panel, { padding: 32, alignItems: "center" }]}>
				<ActivityIndicator size="large" color={COLOURS.Plum} />
			</View>
		);

	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.chatButton
					style={{ width: 17, height: 17 }}
					tintColor="#7e8499"
				/>
				<Text style={styles.panelTitle}>Повідомлення</Text>
			</View>
			<View style={styles.panelHeaderSearch}>
				<SearchInput
					value={search}
					onChangeText={setSearch}
					placeholder="Пошук"
					style={{ width: 370 }}
				/>
			</View>
			{filtered.map((chat: IChat) => {
				const other =
					chat.users?.find(
						(u) => String(u.user?.id) !== String(currentUserId),
					)?.user ?? chat.users?.[0]?.user;

				const name = getDisplayName(
					other?.firstName,
					other?.lastName,
					other?.username,
				);
				const initials = getInitials(
					other?.firstName,
					other?.lastName,
					other?.username,
				);
				const avatarUri = other?.profile?.avatar
					? photoUri(other.profile.avatar)
					: undefined;

				const lastMsg = chat.lastMessage;
				let lastText = "";
				if (lastMsg) {
					const senderName = lastMsg.sender?.username ?? "";
					const prefix = senderName ? `${senderName}: ` : "";

					if (lastMsg.text) lastText = `${prefix}${lastMsg.text}`;
					else if (
						(lastMsg as any).messageImages &&
						(lastMsg as any).messageImages.length > 0
					)
						lastText = `${prefix} Фотографія`;
				} else {
					lastText = `${(chat.users?.length ?? 0) + 1} учасників`;
				}

				const isMyLastMsg =
					lastMsg &&
					String(lastMsg.senderId) === String(currentUserId);
				const isRead =
					(lastMsg?.chat_app_message_readers?.length ?? 0) > 0;

				const dateSource =
					lastMsg?.createdAt || chat.updatedAt || chat.createdAt;
				let lastTime = "";
				const unreadCount = chat._count?.messages ?? 0;

				if (dateSource) {
					const parsedDate = new Date(dateSource);
					if (!isNaN(parsedDate.getTime())) {
						const isToday =
							new Date().toDateString() ===
							parsedDate.toDateString();
						lastTime = isToday
							? formatTime(dateSource)
							: formatDate(dateSource);
					}
				}

				return (
					<TouchableOpacity
						key={chat.id}
						style={styles.messageRow}
						activeOpacity={0.7}
						onPress={() =>
							router.push(
								`/core/chat?id=${chat.id}&fromTab=messages`,
							)
						}
					>
						<Avatar
							size={52}
							uri={avatarUri}
							initials={initials}
							color={getAvatarColor(name)}
						/>
						<View style={styles.messageContent}>
							<View style={styles.messageTop}>
								<Text
									style={styles.messageName}
									numberOfLines={1}
								>
									{name}
								</Text>
								<Text style={styles.messageTime}>
									{lastTime}
								</Text>
							</View>
							<View style={styles.messageBottom}>
								<Text
									style={styles.messageText}
									numberOfLines={1}
								>
									{lastText}
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 4,
									}}
								>
									{isMyLastMsg && (
										<Ionicons
											name={
												isRead
													? "checkmark-done"
													: "checkmark"
											}
											size={14}
											color={
												isRead
													? COLOURS.Plum
													: COLOURS.Blue50
											}
										/>
									)}
									{!isMyLastMsg && unreadCount > 0 && (
										<View style={styles.unreadBadge}>
											<Text
												style={styles.unreadBadgeText}
											>
												{unreadCount > 99
													? "99+"
													: unreadCount}
											</Text>
										</View>
									)}
								</View>
							</View>
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

function GroupChatsTab() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const { data: groupChats = [], isLoading } = useGetGroupChatsQuery();
	const filtered = useMemo((): IChat[] => {
		if (!search.trim()) return groupChats as IChat[];
		const q = search.toLowerCase();
		return (groupChats as IChat[]).filter((c) =>
			c.name?.toLowerCase().includes(q),
		);
	}, [search, groupChats]);

	if (isLoading)
		return (
			<View style={[styles.panel, { padding: 32, alignItems: "center" }]}>
				<ActivityIndicator size="large" color={COLOURS.Plum} />
			</View>
		);

	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.chatButton
					style={{ width: 17, height: 17 }}
					tintColor="#7e8499"
				/>
				<Text style={styles.panelTitle}>Групові чати</Text>
			</View>
			<View style={styles.panelHeaderSearch}>
				<SearchInput
					value={search}
					onChangeText={setSearch}
					placeholder="Пошук"
					style={{ width: 370 }}
				/>
			</View>
			{filtered.map((chat: IChat) => {
				const name = chat.name ?? "Група";
				const initials = getAutoAvatar(name);
				const avatarUri =
					chat.avatar && chat.avatar !== "default-group-avatar.png"
						? photoUri(chat.avatar)
						: undefined;

				const lastMsg = chat.lastMessage;
				let lastText = "";
				if (lastMsg) {
					if (lastMsg.text) lastText = lastMsg.text;
					else if (
						(lastMsg as any).messageImages &&
						(lastMsg as any).messageImages.length > 0
					)
						lastText = "Фотографія";
				} else {
					lastText = `${(chat.users?.length ?? 0) + 1} учасників`;
				}

				const dateSource =
					lastMsg?.createdAt || chat.updatedAt || chat.createdAt;
				let lastTime = "";
				if (dateSource) {
					const parsedDate = new Date(dateSource);
					if (!isNaN(parsedDate.getTime())) {
						const isToday =
							new Date().toDateString() ===
							parsedDate.toDateString();
						lastTime = isToday
							? formatTime(dateSource)
							: formatDate(dateSource);
					}
				}

				return (
					<TouchableOpacity
						key={chat.id}
						style={styles.messageRow}
						activeOpacity={0.7}
						onPress={() =>
							router.push(
								`/core/chat?id=${chat.id}&fromTab=groupChats`,
							)
						}
					>
						<Avatar
							size={52}
							uri={avatarUri}
							initials={initials}
							color={COLOURS.Plum}
						/>
						<View style={styles.messageContent}>
							<View style={styles.messageTop}>
								<Text
									style={styles.messageName}
									numberOfLines={1}
								>
									{name}
								</Text>
								<Text style={styles.messageTime}>
									{lastTime}
								</Text>
							</View>
							<Text style={styles.messageText} numberOfLines={1}>
								{lastText}
							</Text>
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

export default function ChatsScreen() {
	const router = useRouter();
	useSocketEvents();
	const { tab } = useLocalSearchParams<{ tab?: string }>();
	const [activeTab, setActiveTab] = useState<
		"contacts" | "messages" | "groupChats"
	>((tab as "contacts" | "messages" | "groupChats") ?? "contacts");
	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);
	const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

	useEffect(() => {
		if (tab && ["contacts", "messages", "groupChats"].includes(tab)) {
			setActiveTab(tab as any);
		}
	}, [tab]);

	useEffect(() => {
		getCurrentUserId().then(setCurrentUserId);
	}, []);

	const { data: friendsResponse, isLoading } = useGetAllFriendsQuery();

	const friendsList: IUser[] = useMemo(() => {
		if (!friendsResponse) return [];

		let users: IUser[];

		if (!currentUserId) {
			users = friendsResponse
				.flatMap((f) => [f.fromUser, f.toUser])
				.filter((u): u is IUser => u !== null && u !== undefined);
		} else {
			users = friendsResponse
				.map((friendship) => {
					const isFromMe =
						String(friendship.from_user_id) ===
						String(currentUserId);
					const friendUser = isFromMe
						? friendship.toUser
						: friendship.fromUser;
					return friendUser ?? null;
				})
				.filter((user): user is IUser => user !== null);
		}

		return [...new Map(users.map((u) => [u.id, u])).values()];
	}, [friendsResponse, currentUserId]);

	const { data: personalChats = [] } = useGetPersonalChatsQuery();
	const { data: groupChats = [] } = useGetGroupChatsQuery();

	const totalUnreadPersonal = useMemo(
		() =>
			(personalChats as IChat[]).reduce(
				(sum, c) => sum + (c._count?.messages ?? 0),
				0,
			),
		[personalChats],
	);

	const totalUnreadGroup = useMemo(
		() =>
			(groupChats as IChat[]).reduce(
				(sum, c) => sum + (c._count?.messages ?? 0),
				0,
			),
		[groupChats],
	);

	const tabs = [
		{
			key: "contacts",
			label: "Контакти",
			icon: <IMAGES.friendsButton style={styles.iconContacts} />,
			unread: 0,
		},
		{
			key: "messages",
			label: "Повідомлення",
			icon: <IMAGES.chatButton style={styles.icon} />,
			unread: totalUnreadPersonal,
		},
		{
			key: "groupChats",
			label: "Групові чати",
			icon: <IMAGES.chatButton style={styles.icon} />,
			unread: totalUnreadGroup,
		},
	] as const;

	const handleSelectSave = (ids: string[]) => {
		setSelectedUserIds(ids);
		setIsSelectModalOpen(false);
		setIsDetailsModalOpen(true);
	};
	const handleRemoveUser = (id: string) =>
		setSelectedUserIds((prev) => prev.filter((i) => i !== id));
	const handleAddMore = () => {
		setIsDetailsModalOpen(false);
		setIsSelectModalOpen(true);
	};

	const handleCreateGroup = async (data: GroupDetailsData) => {
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			selectedUserIds.forEach((id) => formData.append("userIds", id));
			formData.append("isGroup", "true");
			const chat = (await createChat(formData).unwrap()) as IChat;
			setIsDetailsModalOpen(false);
			setSelectedUserIds([]);
			router.push(`/core/chat?id=${chat.id}&fromTab=groupChats`);
		} catch {
			Alert.alert("Помилка", "Не вдалося створити групу");
		}
	};

	const handleContactPress = async (user: IUser) => {
		try {
			const formData = new FormData();
			formData.append("name", user.firstName ?? user.username ?? "Чат");
			formData.append("userIds", user.id);
			formData.append("isGroup", "false");
			const chat = (await createChat(formData).unwrap()) as IChat;
			router.push(`/core/chat?id=${chat.id}&fromTab=messages`);
		} catch {
			Alert.alert("Помилка", "Не вдалося створити чат");
		}
	};

	const selectedUsersData = friendsList.filter((user) =>
		selectedUserIds.includes(user.id),
	);

	return (
		<View style={styles.container}>
			<Header
				showCreateButton
				showLogoutButton
				onCreatePress={() => setIsSelectModalOpen(true)}
			/>
			<View style={styles.tabsContainer}>
				{tabs.map((t) => {
					const isActive = activeTab === t.key;
					return (
						<TouchableOpacity
							key={t.key}
							style={styles.tab}
							onPress={() => setActiveTab(t.key)}
							activeOpacity={0.7}
						>
							<View style={styles.iconWrapper}>
								{t.icon}
								{t.unread > 0 && (
									<View style={styles.tabBadge}>
										<Text style={styles.tabBadgeText}>
											{t.unread > 99 ? "99+" : t.unread}
										</Text>
									</View>
								)}
							</View>
							<Text style={styles.tabTextActive}>{t.label}</Text>
							{isActive && <View style={styles.indicator} />}
						</TouchableOpacity>
					);
				})}
			</View>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{activeTab === "contacts" && (
					<ContactsTab
						users={friendsList}
						isLoading={isLoading}
						onContactPress={handleContactPress}
					/>
				)}
				{activeTab === "messages" && (
					<MessagesTab currentUserId={currentUserId} />
				)}
				{activeTab === "groupChats" && <GroupChatsTab />}
			</ScrollView>
			<SelectUsersModal
				visible={isSelectModalOpen}
				onClose={() => setIsSelectModalOpen(false)}
				users={friendsList}
				onSave={handleSelectSave}
				title="Нова група"
				buttonText="Далі"
			/>
			<GroupDetailsModal
				visible={isDetailsModalOpen}
				onClose={() => setIsDetailsModalOpen(false)}
				selectedUsers={selectedUsersData}
				onRemoveUser={handleRemoveUser}
				onAddMore={handleAddMore}
				onSubmit={handleCreateGroup}
				title="Нова група"
				buttonText={isCreating ? "Створення..." : "Створити групу"}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff" },
	tabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#f2f2f2",
		paddingHorizontal: 8,
	},
	tabBadge: {
		position: "absolute",
		top: -4,
		right: -6,
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
	},
	tabBadgeText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "700",
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
	scrollContent: { paddingHorizontal: 2, paddingTop: 12, paddingBottom: 24 },
	panel: {
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: COLOURS.Blue20,
		overflow: "hidden",
	},
	panelHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 12,
	},
	panelHeaderSearch: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	panelTitle: { fontSize: 18, fontWeight: "500", color: COLOURS.Blue50 },
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	contactName: { fontSize: 15, fontWeight: "500", color: "#111" },
	messageRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	messageContent: { flex: 1 },
	messageTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 3,
	},
	messageBottom: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	messageName: {
		fontSize: 14,
		fontWeight: "600",
		color: COLOURS.darkBlue,
		flex: 1,
		marginRight: 8,
	},
	messageTime: { fontSize: 12, color: COLOURS.Blue50 },
	messageText: { fontSize: 13, color: COLOURS.Blue50, flex: 1 },
	unreadBadge: {
		minWidth: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 5,
	},
	unreadBadgeText: {
		color: "#fff",
		fontSize: 11,
		fontWeight: "700",
	},
});
