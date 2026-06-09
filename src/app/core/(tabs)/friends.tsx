import React, { useState, useEffect, useCallback } from "react";
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
import { IFriendship, IUser } from "@modules/friends/api/friend.types";

type Tab = "main" | "requests" | "recommendations" | "all friends";

const TAB_LABELS: Record<Tab, string> = {
	main: "Головна",
	requests: "Запити",
	recommendations: "Рекомендації",
	"all friends": "Всі друзі",
};

const TABS: Tab[] = ["main", "requests", "recommendations", "all friends"];

export default function FriendsScreen() {
	const [activeTab, setActiveTab] = useState<Tab>("main");
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState("");
	const [pendingAction, setPendingAction] = useState<(() => void) | null>(
		null,
	);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [hiddenSuggestions, setHiddenSuggestions] = useState<string[]>([]);

	useEffect(() => {
		getCurrentUserId().then((id) => setCurrentUserId(String(id)));
	}, []);

	const { data: overview, isLoading: overviewLoading } = useGetOverviewQuery(
		undefined,
		{
			skip: activeTab !== "main",
		},
	);
	const { data: requests, isLoading: requestsLoading } =
		useGetRequestsQuery();
	const { data: suggestions, isLoading: suggestionsLoading } =
		useGetSuggestionsQuery();
	const { data: friends, isLoading: friendsLoading } =
		useGetAllFriendsQuery();

	const [acceptAction] = useAcceptActionMutation();
	const [deleteAction] = useDeleteActionMutation();

	useEffect(() => {
		if (suggestions) setHiddenSuggestions([]);
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

	const handleDeleteFriend = async (id: string) => {
		await deleteAction({ id: Number(id) });
	};

	const handleAcceptSuggestion = async (id: string) => {
		try {
			await acceptAction({ id: Number(id) }).unwrap();
		} catch (e) {
			console.error("acceptSuggestion error:", e);
		}
	};

	const getUserFromRequest = (item: IFriendship): IUser | null =>
		item.fromUser ?? null;

	const getUserFromFriend = useCallback(
		(item: IFriendship): IUser | null => {
			if (!currentUserId) return item.fromUser ?? item.toUser ?? null;
			return String(item.from_user_id) === currentUserId
				? (item.toUser ?? null)
				: (item.fromUser ?? null);
		},
		[currentUserId],
	);

	const renderLoader = () => (
		<ActivityIndicator style={{ marginTop: 32 }} color={COLOURS.Plum} />
	);

	const renderScrollList = (children: React.ReactNode) => (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.contentScroll}
		>
			{children}
		</ScrollView>
	);

	const renderSectionHeader = (title: string, tab: Tab) => (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<TouchableOpacity onPress={() => setActiveTab(tab)}>
				<Text style={styles.sectionLink}>Дивитись всі</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<Header showSettingsButton showLogoutButton />

			<View style={styles.tabsContainer}>
				{TABS.map((tab) => (
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
							{TAB_LABELS[tab]}
						</Text>
						{activeTab === tab && <View style={styles.indicator} />}
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.contentWrapper}>
				{activeTab === "main" &&
					(overviewLoading
						? renderLoader()
						: renderScrollList(
								<>
									{renderSectionHeader("Запити", "requests")}
									{overview?.requests
										.slice(0, 2)
										.map((item) => {
											const user =
												getUserFromRequest(item);
											if (!user) return null;
											return (
												<FriendCard
													key={`main-req-${item.id}`}
													user={user}
													variant="request"
													onPrimaryPress={() =>
														acceptAction({
															id: Number(item.id),
														})
													}
													onSecondaryPress={() =>
														openModal(
															"Відхилити запит?",
															() =>
																deleteAction({
																	id: Number(
																		item.id,
																	),
																	type: "request",
																}),
														)
													}
												/>
											);
										})}

									<View style={{ marginTop: 24 }}>
										{renderSectionHeader(
											"Рекомендації",
											"recommendations",
										)}
									</View>
									{overview?.suggestions
										.filter(
											(user) =>
												!hiddenSuggestions.includes(
													user.id,
												),
										)
										.slice(0, 2)
										.map((user) => (
											<FriendCard
												key={`main-rec-${user.id}`}
												user={user}
												variant="recommendation"
												onPrimaryPress={() =>
													handleAcceptSuggestion(
														user.id,
													)
												}
												onSecondaryPress={() =>
													setHiddenSuggestions(
														(prev) => [
															...prev,
															user.id,
														],
													)
												}
											/>
										))}

									<View style={{ marginTop: 24 }}>
										{renderSectionHeader(
											"Всі друзі",
											"all friends",
										)}
									</View>
									{overview?.friends
										.slice(0, 2)
										.map((item) => {
											const user =
												getUserFromFriend(item);
											if (!user) return null;
											return (
												<FriendCard
													key={`main-fr-${item.id}`}
													user={user}
													variant="friend"
													onPrimaryPress={() => {}}
													onSecondaryPress={() =>
														openModal(
															"Видалити з друзів?",
															() =>
																handleDeleteFriend(
																	item.id,
																),
														)
													}
												/>
											);
										})}
								</>,
							))}

				{activeTab === "requests" &&
					(requestsLoading
						? renderLoader()
						: renderScrollList(
								requests?.map((item) => {
									const user = getUserFromRequest(item);
									if (!user) return null;
									return (
										<FriendCard
											key={`req-${item.id}`}
											user={user}
											variant="request"
											onPrimaryPress={() =>
												acceptAction({
													id: Number(item.id),
												})
											}
											onSecondaryPress={() =>
												openModal(
													"Відхилити запит?",
													() =>
														deleteAction({
															id: Number(item.id),
															type: "request",
														}),
												)
											}
										/>
									);
								}),
							))}

				{activeTab === "recommendations" &&
					(suggestionsLoading
						? renderLoader()
						: renderScrollList(
								suggestions
									?.filter(
										(user) =>
											!hiddenSuggestions.includes(
												user.id,
											),
									)
									.map((user) => (
										<FriendCard
											key={`rec-${user.id}`}
											user={user}
											variant="recommendation"
											onPrimaryPress={() =>
												handleAcceptSuggestion(user.id)
											}
											onSecondaryPress={() =>
												setHiddenSuggestions((prev) => [
													...prev,
													user.id,
												])
											}
										/>
									)),
							))}

				{activeTab === "all friends" &&
					(friendsLoading
						? renderLoader()
						: renderScrollList(
								friends?.map((item) => {
									const user = getUserFromFriend(item);
									if (!user) return null;
									return (
										<FriendCard
											key={`fr-${item.id}`}
											user={user}
											variant="friend"
											onPrimaryPress={() => {}}
											onSecondaryPress={() =>
												openModal(
													"Видалити з друзів?",
													() =>
														handleDeleteFriend(
															item.id,
														),
												)
											}
										/>
									);
								}),
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
