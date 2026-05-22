import { useState } from "react";
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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@shared/ui/header";
import { IMAGES } from "@shared/ui/images";
import { COLOURS } from "@shared/constants/colours";
import { Footer } from "@shared/ui/footer";
import { GroupDetailsModal } from "@shared/ui/modals/group-details-modal";

type ChatMessage = {
	id: string;
	text: string;
	time: string;
	sender: string;
	avatar?: string | null;
	status: string;
	isNew?: boolean;
};

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
	"123": [
		{
			id: "1",
			text: "Привіт!",
			time: "10:01",
			sender: "me",
			status: "read",
		},
		{
			id: "2",
			text: "Привіт! Як справи ?",
			time: "10:30",
			sender: "Wade Warner",
			avatar: null,
			status: "read",
		},
		{
			id: "3",
			text: "Чудово!",
			time: "10:30",
			sender: "Cameron Williamson",
			avatar: null,
			status: "read",
			isNew: true,
		},
	],
};

const AVATAR_COLORS: Record<string, string> = {
	"Wade Warner": "#f4a261",
	"Cameron Williamson": "#e76f51",
};

export default function ChatScreen() {
	const router = useRouter();
	const { id, fromTab } = useLocalSearchParams<{
		id: string;
		fromTab?: string;
	}>();
	const [message, setMessage] = useState("");
	const messages = MOCK_MESSAGES[id as string] ?? [];

	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

	const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

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

	const [activeTab, setActiveTab] = useState<
		"contacts" | "messages" | "groupChats"
	>((fromTab as "contacts" | "messages" | "groupChats") ?? "groupChats");

	const [isActionModalOpen, setIsActionModalOpen] = useState(false);

	const newMessageIndex = messages.findIndex((m) => m.isNew);

	const renderMessage = ({
		item,
		index,
	}: {
		item: (typeof messages)[0];
		index: number;
	}) => {
		const isMe = item.sender === "me";
		const showNewDivider = index === newMessageIndex;

		return (
			<>
				{showNewDivider && (
					<View style={styles.newDivider}>
						<View style={styles.newDividerLine} />
						<Text style={styles.newDividerText}>
							Нові повідомлення
						</Text>
						<View style={styles.newDividerLine} />
					</View>
				)}
				<View
					style={[
						styles.messageWrapper,
						isMe
							? styles.messageWrapperMe
							: styles.messageWrapperOther,
					]}
				>
					{!isMe && (
						<View
							style={[
								styles.avatarSmall,
								{
									backgroundColor:
										AVATAR_COLORS[item.sender] ?? "#c8cadc",
								},
							]}
						>
							<Text style={styles.avatarSmallText}>
								{item.sender.charAt(0)}
							</Text>
						</View>
					)}
					<View style={styles.col}>
						{!isMe && (
							<Text style={styles.senderName}>{item.sender}</Text>
						)}
						<View
							style={[
								styles.bubble,
								isMe ? styles.bubbleMe : styles.bubbleOther,
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
							<View style={styles.bubbleMeta}>
								<Text
									style={[
										styles.bubbleTime,
										isMe && styles.bubbleTimeMe,
									]}
								>
									{item.time}
								</Text>
								<Ionicons
									name="checkmark-done"
									size={14}
									color={
										isMe
											? "rgba(255,255,255,0.7)"
											: "#aab0c0"
									}
									style={{ marginLeft: 2 }}
								/>
							</View>
						</View>
					</View>
				</View>
			</>
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
				onCreatePress={() => setIsSelectModalOpen(true)}
			/>

			<View style={styles.tabsContainer}>
				{tabs.map((tab) => {
					const isActive = activeTab === tab.key;
					return (
						<TouchableOpacity
							key={tab.key}
							style={styles.tab}
							onPress={() =>
								router.push(`/core/chats?tab=${tab.key}`)
							}
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

			<View style={styles.header}>
				<TouchableOpacity
					onPress={() =>
						router.push(
							`/core/chats?tab=${fromTab ?? "groupChats"}`,
						)
					}
					style={styles.backBtn}
				>
					<Ionicons name="chevron-back" size={24} color="#7e8499" />
				</TouchableOpacity>
				<View style={styles.headerAvatar}>
					<Text style={styles.headerAvatarText}>NG</Text>
				</View>
				<View style={styles.headerInfo}>
					<Text style={styles.headerName}>New Group</Text>
					<Text style={styles.headerSub}>3 учасники, 1 в мережі</Text>
				</View>
				<TouchableOpacity
					style={styles.moreBtn}
					onPress={() => setIsActionModalOpen(true)}
				>
					<Ionicons
						name="ellipsis-vertical"
						size={20}
						color="#7e8499"
					/>
				</TouchableOpacity>
			</View>

			<FlatList
				data={messages}
				keyExtractor={(item) => item.id}
				renderItem={renderMessage}
				contentContainerStyle={styles.messagesList}
				ListHeaderComponent={
					<View style={styles.dateBadge}>
						<Text style={styles.dateBadgeText}>25 квітня 2025</Text>
					</View>
				}
			/>

			<View style={styles.inputBar}>
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					placeholder="Повідомлення"
					placeholderTextColor="#8c9199"
				/>
				<TouchableOpacity style={styles.attachBtn}>
					<IMAGES.GalleryButton></IMAGES.GalleryButton>
				</TouchableOpacity>
				<TouchableOpacity style={styles.sendBtn}>
					<IMAGES.HandButton></IMAGES.HandButton>
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
								onPress={() =>
									setIsActionModalOpen((prev) => !prev)
								}
							>
								<Ionicons
									name="ellipsis-vertical"
									size={20}
									color="#7e8499"
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

						<TouchableOpacity
							style={styles.dropdownItem}
							activeOpacity={0.7}
							onPress={() => {
								setIsActionModalOpen(false);
								setIsGroupDetailsOpen(true);
							}}
						>
							<IMAGES.PenButton
								style={{ width: 16, height: 16 }}
							/>

							<Text style={styles.dropdownText}>
								Редагувати групу
							</Text>
						</TouchableOpacity>
						<View style={styles.dropdownDivider} />

						<TouchableOpacity
							style={styles.dropdownItem}
							activeOpacity={0.7}
						>
							<Ionicons
								name="log-out-outline"
								size={19}
								color="#1B1A2A"
							/>

							<Text style={styles.dropdownText}>
								Покинути групу
							</Text>
						</TouchableOpacity>
					</View>
				</>
			)}

			<GroupDetailsModal
				visible={isGroupDetailsOpen}
				onClose={() => setIsGroupDetailsOpen(false)}
				selectedUsers={[]}
				onRemoveUser={() => {}}
				onAddMore={() => {}}
				onSubmit={(data) => {
					console.log(data);
					setIsGroupDetailsOpen(false);
				}}
				title="Редагування групи"
				buttonText="Зберегти зміни"
				initialName="New Group"
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLOURS.white },
	header: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
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
	headerAvatarText: { color: "#fff", fontWeight: "700", fontSize: 14 },
	headerInfo: { flex: 1 },
	headerName: { fontSize: 15, fontWeight: "600", color: "#1a1d2e" },
	headerSub: { fontSize: 12, color: "#7e8499", marginTop: 1 },
	moreBtn: { padding: 4 },
	messagesList: { padding: 16, gap: 12 },
	dateBadge: {
		alignSelf: "center",
		backgroundColor: COLOURS.Plum50,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 4,
		marginBottom: 16,
	},
	dateBadgeText: { fontSize: 12, color: "#7e8499" },
	newDivider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 12,
		gap: 8,
	},
	newDividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLOURS.Blue20,
	},
	newDividerText: {
		fontSize: 12,
		color: "#7e8499",
	},
	messageWrapper: {
		flexDirection: "row",
		marginBottom: 10,
		alignItems: "flex-end",
		gap: 8,
	},
	messageWrapperMe: { justifyContent: "flex-end" },
	messageWrapperOther: { justifyContent: "flex-start" },
	avatarSmall: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 2,
	},
	avatarSmallText: { fontSize: 15, fontWeight: "600", color: "#fff" },
	col: { maxWidth: "75%" },
	senderName: {
		fontSize: 11,
		color: "#7e8499",
		marginBottom: 3,
		marginLeft: 4,
	},
	bubble: {
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 8,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 6,
	},
	bubbleMe: { backgroundColor: COLOURS.Plum50, borderBottomRightRadius: 4 },
	bubbleOther: {
		backgroundColor: "#fff",
		borderBottomLeftRadius: 4,
		borderWidth: 1,
		borderColor: COLOURS.Blue20,
	},
	bubbleText: { fontSize: 14, color: "#1a1d2e", flexShrink: 1 },
	bubbleTextMe: { color: "#1a1d2e" },
	bubbleMeta: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-end",
		marginBottom: 1,
	},
	bubbleTime: { fontSize: 10, color: "#aab0c0" },
	bubbleTimeMe: { color: "#aab0c0" },
	inputBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
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
		color: "#1a1d2e",
	},

	attachBtn: {
		width: 40,
		height: 40,
		borderRadius: 25,
		borderWidth: 1.5,
		borderColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},

	sendBtn: {
		width: 40,
		height: 40,
		borderRadius: 25,
		backgroundColor: COLOURS.Plum,
		alignItems: "center",
		justifyContent: "center",
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

		backgroundColor: "#F4F1F8",
		borderRadius: 10,

		paddingTop: 20,
		paddingBottom: 2,

		zIndex: 30,
	},

	dropdownDots: {
		position: "absolute",
		top: 4,
		right: 4,
	},

	dropdownItem: {
		flexDirection: "row",
		alignItems: "center",

		gap: 8,

		paddingHorizontal: 10,
		paddingVertical: 8,
	},

	dropdownText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1B1A2A",
	},

	dropdownDivider: {
		height: 1,
		backgroundColor: "#D8D2DF",
		marginHorizontal: 10,
	},
});
