import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { IMAGES } from "../../../shared/ui/images";

const CONTACTS = [
	{ id: "1", name: "Jane Cooper" },
	{ id: "2", name: "Cameron Williamson" },
	{ id: "3", name: "Leslie Alexander" },
	{ id: "4", name: "Robert Fox" },
	{ id: "5", name: "Jacob Jones" },
	{ id: "6", name: "Brooklyn Simmons" },
	{ id: "7", name: "Brooklyn Simmons" },
];

const MESSAGES = [
	{
		id: "1",
		name: "Mona Lisa",
		text: "Привіт! Як справи ?",
		time: "09:41",
		online: true,
		unread: 2,
		active: true,
	},
	{
		id: "2",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
		active: false,
	},
	{
		id: "3",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
		active: false,
	},
	{
		id: "4",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
		active: false,
	},
	{
		id: "5",
		name: "Ann Ti",
		text: "Привіт!",
		time: "25.04.2025",
		online: false,
		unread: 0,
		active: false,
	},
];

const GROUP_CHATS = [
	{
		id: "1",
		name: "Команда проекту",
		text: "Привіт всім!",
		time: "10:30",
		online: false,
		unread: 5,
		active: false,
	},
	{
		id: "2",
		name: "New Group",
		text: "Чудово!",
		time: "10:30",
		online: false,
		unread: 0,
		active: false,
	},
	{
		id: "3",
		name: "Робота",
		text: "Зустріч о 15:00",
		time: "25.04.2025",
		online: false,
		unread: 0,
		active: false,
	},
];

function Avatar({ size = 52 }: { size?: number }) {
	return (
		<View
			style={[
				styles.avatar,
				{ width: size, height: size, borderRadius: size / 2 },
			]}
		/>
	);
}

function ContactsTab() {
	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.friendsButton
					style={{ width: 22, height: 16 }}
					tintColor="#8a90a8"
				/>
				<Text style={styles.panelTitle}>Контакти</Text>
			</View>
			{CONTACTS.map((contact) => (
				<TouchableOpacity
					key={contact.id}
					style={styles.contactRow}
					activeOpacity={0.7}
				>
					<Avatar />
					<Text style={styles.contactName}>{contact.name}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

function MessagesTab() {
	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.chatButton
					style={{ width: 17, height: 17 }}
					tintColor="#7e8499"
				/>
				<Text style={styles.panelTitle}>Повідомлення</Text>
			</View>
			{MESSAGES.map((msg) => (
				<TouchableOpacity
					key={msg.id}
					style={styles.messageRow}
					activeOpacity={0.7}
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

	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<IMAGES.chatButton
					style={{ width: 17, height: 17 }}
					tintColor="#7e8499"
				/>
				<Text style={styles.panelTitle}>Групові чати</Text>
			</View>
			{GROUP_CHATS.map((msg) => (
				<TouchableOpacity
					key={msg.id}
					style={styles.messageRow}
					activeOpacity={0.7}
					onPress={() => router.push(`/chat/${msg.id}`)}
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
	const [activeTab, setActiveTab] = useState<
		"contacts" | "messages" | "groupChats"
	>("contacts");



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

	return (
		<View style={styles.container}>
			<Header showCreateButton showLogoutButton />

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
				{activeTab === "contacts" && <ContactsTab />}
				{activeTab === "messages" && <MessagesTab />}
				{activeTab === "groupChats" && <GroupChatsTab />}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
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
	iconWrapper: {
		position: "relative",
	},
	icon: {
		width: 16,
		height: 16,
	},
	iconContacts: {
		width: 22,
		height: 16,
	},
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
	badgeText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "600",
	},
	tabTextActive: {
		color: COLOURS.darkBlue,
		fontWeight: "600",
	},
	indicator: {
		position: "absolute",
		top: 0,
		left: "50%",
		transform: [{ translateX: -30 }],
		width: 60,
		height: 2,
		backgroundColor: COLOURS.Plum,
	},
	scrollContent: {
		paddingHorizontal: 2,
		paddingTop: 12,
		paddingBottom: 24,
	},
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
	panelTitle: {
		fontSize: 18,
		fontWeight: "500",
		color: COLOURS.Blue50,
	},
	headerBadge: {
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
	headerBadgeText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "700",
	},
	avatar: {
		backgroundColor: "#e5e7eb",
	},
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	contactName: {
		fontSize: 15,
		fontWeight: "500",
		color: "#111",
	},
	messageRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	avatarWrapper: {
		position: "relative",
	},
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
	messageContent: {
		flex: 1,
	},
	messageTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 2,
	},
	messageName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#111",
	},
	messageTime: {
		fontSize: 12,
		color: "#9ca3af",
	},
	messageText: {
		fontSize: 13,
		color: "#6b7280",
	},
});