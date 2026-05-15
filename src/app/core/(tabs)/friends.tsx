import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { FriendActionModal } from "@modules/friends/ui/components/friend-action-modal/friend-action-modal";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import {
	useAcceptActionMutation,
	useDeleteActionMutation,
	useGetAllFriendsQuery,
	useGetOverviewQuery,
	useGetRequestsQuery,
	useGetSuggestionsQuery,
} from "@modules/friends/api/friend.api";
import { BASE_URL } from "@shared/config/api.config";

function photoUri(url: string): string {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

export default function FriendsScreen() {
	const [activeTab, setActiveTab] = useState<"main" | "requests" | "recommendations" | "all friends">("main");
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState("");
	const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);
	const [hiddenSuggestions, setHiddenSuggestions] = useState<number[]>([]);

	useEffect(() => {
		getCurrentUserId().then(setCurrentUserId);
	}, []);

	const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useGetOverviewQuery(undefined, {
		skip: activeTab !== "main",
	});
	const { data: requests, isLoading: requestsLoading } = useGetRequestsQuery();
	const { data: suggestions, isLoading: suggestionsLoading, refetch: refetchSuggestions } = useGetSuggestionsQuery();
	const { data: friends, isLoading: friendsLoading } = useGetAllFriendsQuery();

	const [acceptAction] = useAcceptActionMutation();
	const [deleteAction] = useDeleteActionMutation();

	useEffect(() => {
		if (suggestions) {
			setHiddenSuggestions([]);
		}
	}, [suggestions]);

	const openModal = (text: string, action: () => void) => {
		setModalText(text);
		setPendingAction(() => action);
		setModalVisible(true);
	};

	const handleConfirm = () => {
		pendingAction?.();
		setModalVisible(false);
		setPendingAction(null);
	};

	const handleCancel = () => {
		setModalVisible(false);
		setPendingAction(null);
	};

	const handleDeleteFriend = async (id: number) => {
		await deleteAction({ id });
		refetchSuggestions();
		if (activeTab === "main") refetchOverview();
	};

	const handleAcceptSuggestion = async (id: number) => {
		await acceptAction({ id, type: "suggestion" });
		refetchSuggestions();
		if (activeTab === "main") refetchOverview();
	};

	const getAvatarSource = (user: any) => {
		const activeAvatar =
			user?.avatars?.find((a: any) => a.isActive) ?? user?.avatars?.[0];
		const url = activeAvatar?.image?.normalImageURL;
		return url
			? { uri: photoUri(url) }
			: require("../../../assets/Frame1.png");
	};

	const getFriendFromFriendship = (item: any, variant: "request" | "friend") => {
		if (variant === "request") return item.fromProfileRel ?? null;
		if (!currentUserId) return item.fromProfileRel ?? item.toProfileRel ?? null;
		return item.from_profile === currentUserId
			? item.toProfileRel
			: item.fromProfileRel;
	};

	const mapFriendship = (item: any, variant: "request" | "friend") => {
		const user = getFriendFromFriendship(item, variant);
		return {
			id: user?.id,
			avatarUrl: getAvatarSource(user),
			name: `${user?.name ?? ""} ${user?.surname ?? ""}`.trim() || "",
			alias: user?.nickname ? `@${user.nickname}` : "",
			isOnline: user?.isOnline ?? false,
		};
	};

	const mapSuggestion = (user: any) => ({
		id: user?.id,
		avatarUrl: getAvatarSource(user),
		name: `${user?.name ?? ""} ${user?.surname ?? ""}`.trim() || "",
		alias: user?.nickname ? `@${user.nickname}` : "",
		isOnline: user?.isOnline ?? false,
	});

	const renderLoader = () => (
		<ActivityIndicator style={{ marginTop: 32 }} color={COLOURS.Plum} />
	);

	return (
		<View style={styles.container}>
			<Header showSettingsButton showLogoutButton />

			<View style={styles.tabsContainer}>
				{(["main", "requests", "recommendations", "all friends"] as const).map((tab) => {
					const labels = {
						main: "Головна",
						requests: "Запити",
						recommendations: "Рекомендації",
						"all friends": "Усі друзі",
					};
					return (
						<TouchableOpacity
							key={tab}
							style={styles.tab}
							onPress={() => setActiveTab(tab)}
						>
							<Text
								style={[
									styles.tabText,
									activeTab === tab && styles.tabTextActive,
								]}
							>
								{labels[tab]}
							</Text>
							{activeTab === tab && <View style={styles.indicator} />}
						</TouchableOpacity>
					);
				})}
			</View>

			<View style={styles.contentWrapper}>
				{activeTab === "main" &&
					(overviewLoading ? (
						renderLoader()
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentScroll}
						>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Запити</Text>
								<TouchableOpacity onPress={() => setActiveTab("requests")}>
									<Text style={styles.sectionLink}>Дивитись всі</Text>
								</TouchableOpacity>
							</View>
							{overview?.requests.slice(0, 2).map((item) => (
								<FriendCard
									key={`main-req-${item.id}`}
									user={mapFriendship(item, "request")}
									variant="request"
									onPrimaryPress={() =>
										acceptAction({ id: item.id, type: "request" })
									}
									onSecondaryPress={() =>
										openModal("Відхилити запит?", () =>
											deleteAction({ id: item.id, type: "request" }),
										)
									}
								/>
							))}

							<View style={[styles.sectionHeader, { marginTop: 24 }]}>
								<Text style={styles.sectionTitle}>Рекомендації</Text>
								<TouchableOpacity onPress={() => setActiveTab("recommendations")}>
									<Text style={styles.sectionLink}>Дивитись всі</Text>
								</TouchableOpacity>
							</View>
							{overview?.suggestions
								.filter((user: any) => !hiddenSuggestions.includes(user.id))
								.slice(0, 2)
								.map((user: any) => (
									<FriendCard
										key={`main-rec-${user.id}`}
										user={mapSuggestion(user)}
										variant="recommendation"
										onPrimaryPress={() => handleAcceptSuggestion(user.id)}
										onSecondaryPress={() =>
											setHiddenSuggestions((prev) => [...prev, user.id])
										}
									/>
								))}

							<View style={[styles.sectionHeader, { marginTop: 24 }]}>
								<Text style={styles.sectionTitle}>Всі друзі</Text>
								<TouchableOpacity onPress={() => setActiveTab("all friends")}>
									<Text style={styles.sectionLink}>Дивитись всі</Text>
								</TouchableOpacity>
							</View>
							{overview?.friends.slice(0, 2).map((item) => (
								<FriendCard
									key={`main-fr-${item.id}`}
									user={mapFriendship(item, "friend")}
									variant="friend"
									onPrimaryPress={() => {}}
									onSecondaryPress={() =>
										openModal("Видалити з друзів?", () =>
											handleDeleteFriend(item.id),
										)
									}
								/>
							))}
						</ScrollView>
					))}

				{activeTab === "requests" &&
					(requestsLoading ? (
						renderLoader()
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentScroll}
						>
							{requests?.map((item) => (
								<FriendCard
									key={`req-${item.id}`}
									user={mapFriendship(item, "request")}
									variant="request"
									onPrimaryPress={() =>
										acceptAction({ id: item.id, type: "request" })
									}
									onSecondaryPress={() =>
										openModal("Відхилити запит?", () =>
											deleteAction({ id: item.id, type: "request" }),
										)
									}
								/>
							))}
						</ScrollView>
					))}

				{activeTab === "recommendations" &&
					(suggestionsLoading ? (
						renderLoader()
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentScroll}
						>
							{suggestions
								?.filter((user: any) => !hiddenSuggestions.includes(user.id))
								.map((user: any) => (
									<FriendCard
										key={`rec-${user.id}`}
										user={mapSuggestion(user)}
										variant="recommendation"
										onPrimaryPress={() => handleAcceptSuggestion(user.id)}
										onSecondaryPress={() =>
											setHiddenSuggestions((prev) => [...prev, user.id])
										}
									/>
								))}
						</ScrollView>
					))}

				{activeTab === "all friends" &&
					(friendsLoading ? (
						renderLoader()
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentScroll}
						>
							{friends?.map((item) => (
								<FriendCard
									key={`fr-${item.id}`}
									user={mapFriendship(item, "friend")}
									variant="friend"
									onPrimaryPress={() => {}}
									onSecondaryPress={() =>
										openModal("Видалити з друзів?", () =>
											handleDeleteFriend(item.id),
										)
									}
								/>
							))}
						</ScrollView>
					))}
			</View>

			<FriendActionModal
				isVisible={isModalVisible}
				description={modalText}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAF8FF",
	},
	tabsContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	tab: {
		marginRight: 24,
		paddingVertical: 5,
		position: "relative",
	},
	tabText: {
		fontSize: 14,
		color: "#9E9E9E",
		fontFamily: "Wals-Medium",
	},
	tabTextActive: {
		color: COLOURS.darkBlue,
		fontFamily: "Wals-Bold",
	},
	indicator: {
		position: "absolute",
		bottom: -1,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: COLOURS.Plum,
		borderRadius: 1,
	},
	contentWrapper: {
		flex: 1,
		backgroundColor: COLOURS.white,
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		borderWidth: 1,
		borderColor: COLOURS.Gray,
		borderBottomWidth: 0,
		overflow: "hidden",
	},
	contentScroll: {
		padding: 16,
		paddingBottom: 100,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontFamily: "Wals-Medium",
		fontSize: 16,
		color: COLOURS.Black,
	},
	sectionLink: {
		fontFamily: "Wals-Medium",
		fontSize: 16,
		color: COLOURS.Plum,
	},
});