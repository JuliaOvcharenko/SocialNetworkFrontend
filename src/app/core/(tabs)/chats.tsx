import { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { BASE_URL } from "@shared/config/api.config";
import { SearchInput } from "@shared/ui/searchInput/searchInput";

const GROUP_CHATS = [
	{
		id: "1",
		name: "Команда проекту",
		text: "Привіт всім!",
		time: "10:30",
		online: false,
		unread: 5,
	},
	{
		id: "2",
		name: "New Group",
		text: "Чудово!",
		time: "10:30",
		online: false,
		unread: 0,
	},
	{
		id: "3",
		name: "Робота",
		text: "Зустріч о 15:00",
		time: "25.04.2025",
		online: false,
		unread: 0,
	},
];

const MESSAGES = [
	{
		id: "1",
		name: "Mona Lisa",
		text: "Привіт! Як справи ?",
		time: "09:41",
		online: true,
		unread: 2,
	},
	{
		id: "2",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
	},
	{
		id: "3",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
	},
	{
		id: "4",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
	},
	{
		id: "5",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
	},
];

function photoUri(url: string): string {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

function getActiveAvatar(avatars: IUser["avatars"]): string {
	const active = avatars?.find((a) => a.isActive);
	return active ? photoUri(active.image.normalImageURL) : "";
}

function Avatar({ size = 52, uri }: { size?: number; uri?: string }) {
	return uri ? (
		<Image
			source={{ uri }}
			style={{ width: size, height: size, borderRadius: size / 2 }}
		/>
	) : (
		<View
			style={[
				styles.avatar,
				{ width: size, height: size, borderRadius: size / 2 },
			]}
		/>
	);
}

function ContactsTab({
	users,
	isLoading,
}: {
	users: IUser[];
	isLoading: boolean;
}) {
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		if (!search.trim()) return users;
		const q = search.toLowerCase();
		return users.filter(
			(u) =>
				u.name.toLowerCase().includes(q) ||
				u.surname.toLowerCase().includes(q),
		);
	}, [search, users]);

	if (isLoading) {
		return (
			<View style={[styles.panel, { padding: 32, alignItems: "center" }]}>
				<ActivityIndicator size="large" color={COLOURS.Plum} />
			</View>
		);
	}

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
			{filtered.map((user) => (
				<TouchableOpacity
					key={user.id}
					style={styles.contactRow}
					activeOpacity={0.7}
				>
					<Avatar uri={getActiveAvatar(user.avatars)} />
					<Text style={styles.contactName}>
						{user.name} {user.surname}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

function MessagesTab() {
	const router = useRouter();
	const [search, setSearch] = useState("");

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
			{MESSAGES.map((msg) => (
				<TouchableOpacity
					key={msg.id}
					style={styles.messageRow}
					activeOpacity={0.7}
					onPress={() =>
						router.push(`/core/chat?id=${msg.id}&fromTab=messages`)
					}
				>
					<View style={styles.avatarWrapper}>
						<Avatar size={52} />
						<View
							style={[
								styles.onlineDot,
								{
									backgroundColor: msg.online
										? "#22c55e"
										: "#d1d5db",
								},
							]}
						/>
					</View>
					<View style={styles.messageContent}>
						<View style={styles.messageTop}>
							<Text style={styles.messageName}>{msg.name}</Text>
							<Text style={styles.messageTime}>{msg.time}</Text>
						</View>
						<Text style={styles.messageText} numberOfLines={1}>
							{msg.text}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
}

function GroupChatsTab() {
	const router = useRouter();
	const [search, setSearch] = useState("");

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
			{GROUP_CHATS.map((msg) => (
				<TouchableOpacity
					key={msg.id}
					style={styles.messageRow}
					activeOpacity={0.7}
					onPress={() =>
						router.push(
							`/core/chat?id=${msg.id}&fromTab=groupChats`,
						)
					}
				>
					<View style={styles.avatarWrapper}>
						<Avatar size={52} />
						<View
							style={[
								styles.onlineDot,
								{
									backgroundColor: msg.online
										? "#22c55e"
										: "#d1d5db",
								},
							]}
						/>
					</View>
					<View style={styles.messageContent}>
						<View style={styles.messageTop}>
							<Text style={styles.messageName}>{msg.name}</Text>
							<Text style={styles.messageTime}>{msg.time}</Text>
						</View>
						<Text style={styles.messageText} numberOfLines={1}>
							{msg.text}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
}

export default function FriendsScreen() {
	const { tab } = useLocalSearchParams<{ tab?: string }>();

	const [activeTab, setActiveTab] = useState<
		"contacts" | "messages" | "groupChats"
	>((tab as "contacts" | "messages" | "groupChats") ?? "contacts");

	useEffect(() => {
		if (tab && ["contacts", "messages", "groupChats"].includes(tab)) {
			setActiveTab(tab as "contacts" | "messages" | "groupChats");
		}
	}, [tab]);

	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);

	useEffect(() => {
		getCurrentUserId().then((id) => setCurrentUserId(id));
	}, []);

	const { data: friendsResponse, isLoading } = useGetAllFriendsQuery();

	const friendsList: IUser[] = useMemo(() => {
		if (!friendsResponse || !currentUserId) return [];
		return friendsResponse
			.map((friendship) => {
				const isMeFrom = friendship.from_profile === currentUserId;
				const friendProfile = isMeFrom
					? friendship.toProfileRel
					: friendship.fromProfileRel;
				return {
					id: friendProfile?.id || 0,
					name: friendProfile?.name || "Невідомий",
					surname: friendProfile?.surname || "",
					nickname: friendProfile?.nickname || "",
					avatars: friendProfile?.avatars || [],
					isOnline: friendProfile?.isOnline || false,
				};
			})
			.filter((user) => user.id !== 0);
	}, [friendsResponse, currentUserId]);

	const tabs = [
		{
			key: "contacts",
			label: "Контакти",
			icon: <IMAGES.friendsButton style={styles.iconContacts} />,
			badge: 0,
		},
		{
			key: "messages",
			label: "Повідомлення",
			icon: <IMAGES.chatButton style={styles.icon} />,
			badge: 0,
		},
		{
			key: "groupChats",
			label: "Групові чати",
			icon: <IMAGES.chatButton style={styles.icon} />,
			badge: 0,
		},
	] as const;

	const handleSelectSave = (ids: number[]) => {
		setSelectedUserIds(ids);
		setIsSelectModalOpen(false);
		setIsDetailsModalOpen(true);
	};

	const handleRemoveUser = (idToRemove: number) => {
		setSelectedUserIds((prev) => prev.filter((id) => id !== idToRemove));
	};

	const handleAddMore = () => {
		setIsDetailsModalOpen(false);
		setIsSelectModalOpen(true);
	};

	const handleCreateGroup = (data: GroupDetailsData) => {
		setIsDetailsModalOpen(false);
		setSelectedUserIds([]);
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
				{tabs.map((tab) => {
					const isActive = activeTab === tab.key;
					return (
						<TouchableOpacity
							key={tab.key}
							style={styles.tab}
							onPress={() => setActiveTab(tab.key)}
							activeOpacity={0.7}
						>
							<View style={styles.iconWrapper}>
								{tab.icon}
								{tab.badge > 0 && (
									<View style={styles.badge}>
										<Text style={styles.badgeText}>
											{tab.badge}
										</Text>
									</View>
								)}
							</View>
							<Text style={styles.tabTextActive}>
								{tab.label}
							</Text>
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
					<ContactsTab users={friendsList} isLoading={isLoading} />
				)}
				{activeTab === "messages" && <MessagesTab />}
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
				buttonText="Створити групу"
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
	badge: {
		position: "absolute",
		top: -6,
		right: -10,
		backgroundColor: COLOURS.Plum,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
	badgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
	tabTextActive: { color: COLOURS.darkBlue, fontWeight: "600" },
	indicator: {
		position: "absolute",
		top: 0,
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
	avatar: { backgroundColor: "#e5e7eb" },
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
	avatarWrapper: { position: "relative" },
	onlineDot: {
		position: "absolute",
		bottom: 2,
		right: 2,
		width: 12,
		height: 12,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: "#fff",
	},
	messageContent: { flex: 1 },
	messageTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 2,
	},
	messageName: { fontSize: 14, fontWeight: "600", color: "#111" },
	messageTime: { fontSize: 12, color: "#9ca3af" },
	messageText: { fontSize: 13, color: "#6b7280" },
});
