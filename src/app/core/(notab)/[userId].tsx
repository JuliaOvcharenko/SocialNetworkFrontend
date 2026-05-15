import React, { useEffect } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	StatusBar,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BASE_URL } from "@shared/config/api.config";
import { useGetUserByIdQuery } from "@modules/auth/api/get-user.api";
import { useGetAlbumsByUserIdQuery } from "@modules/albums/api/album.api";
import { COLOURS } from "@shared/constants/colours";
import {
	useDeleteActionMutation,
	useGetAllFriendsQuery,
	useGetRequestsQuery,
	useSendRequestMutation,
} from "@modules/friends/api/friend.api";
import { Header } from "@shared/ui/header";

function photoUri(url: string): string {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

interface StatItemProps {
	value: string;
	label: string;
}

function StatItem({ value, label }: StatItemProps) {
	return (
		<View style={styles.statItem}>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statLabel}>{label}</Text>
		</View>
	);
}

export default function UserScreen() {
	const router = useRouter();
	const { userId } = useLocalSearchParams<{ userId: string }>();

	const { data: user, isLoading: userLoading } = useGetUserByIdQuery(
		Number(userId),
		{ skip: !userId },
	);

	const { data: albums, isLoading: albumsLoading } =
		useGetAlbumsByUserIdQuery(Number(userId), { skip: !userId });

	const { data: allFriends } = useGetAllFriendsQuery();
	const { data: requests } = useGetRequestsQuery();

	const [sendRequest, { isLoading: sending }] = useSendRequestMutation();
	const [deleteAction, { isLoading: deleting }] = useDeleteActionMutation();

	const friendship = allFriends?.find(
		(f) =>
			f.fromProfileRel?.id === Number(userId) ||
			f.toProfileRel?.id === Number(userId),
	);

	const pendingRequest = requests?.find(
		(r) =>
			r.fromProfileRel?.id === Number(userId) ||
			r.toProfileRel?.id === Number(userId),
	);

	const isFriend = !!friendship;
	const isPending = !!pendingRequest;

	useEffect(() => {
		if (user) {
			// console.log("USER AVATARS:", JSON.stringify(user.avatars, null, 2));
		}
	}, [user]);

	const getAvatarUrl = () => {
		const activeAvatar =
			user?.avatars?.find((a: any) => a.isActive) ?? user?.avatars?.[0];
		const image = activeAvatar?.image as any;
		const url = image?.normalImageURL ?? image?.shakalImageURL;
		return url
			? { uri: photoUri(url) }
			: require("../../../assets/Frame1.png");
	};

	const getAlbumCover = (album: any) => {
		const firstImage =
			album?.images?.[0]?.image?.normalImageURL ??
			album?.images?.[0]?.image?.shakalImageURL;
		return firstImage ? { uri: photoUri(firstImage) } : null;
	};

	const handlePrimaryAction = async () => {
		if (isFriend || isPending) return;
		try {
			await sendRequest({ targetUserId: Number(userId) }).unwrap();
		} catch (e) {
		}
	};

	const handleDeleteAction = async () => {
		const id = friendship?.id ?? pendingRequest?.id;
		if (!id) return;
		try {
			await deleteAction({
				id,
				type: isPending ? "request" : undefined,
			}).unwrap();
		} catch (e) {
		}
	};

	const primaryLabel = isFriend ? "Друзі" : "Додати в друзі";

	const isActionLoading = sending || deleting;

	if (userLoading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<ActivityIndicator style={{ marginTop: 32 }} color={ACCENT} />
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.safeArea}>
			<Header showSettingsButton showLogoutButton />
			<StatusBar barStyle="dark-content" backgroundColor={BG} />

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.profileCard}>
					<View style={styles.header}>
						<TouchableOpacity
							style={styles.backButton}
							activeOpacity={0.7}
							onPress={() => router.back()}
						>
							<Text style={styles.backArrow}>‹</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.avatarWrapper}>
						<Image source={getAvatarUrl()} style={styles.avatar} />
					</View>

					<Text style={styles.displayName}>
						{`${user?.name ?? ""} ${user?.surname ?? ""}`.trim() ||
							"Без імені"}
					</Text>
					<Text style={styles.username}>
						{user?.nickname ? `@${user.nickname}` : ""}
					</Text>

					<View style={styles.statsRow}>
						<StatItem value="0" label="Дописи" />
						<View style={styles.statDivider} />
						<StatItem value="0" label="Читачі" />
						<View style={styles.statDivider} />
						<StatItem value="0" label="Друзі" />
					</View>

					<View style={styles.buttonsRow}>
						<TouchableOpacity
							style={[
								styles.primaryBtn,
								(isFriend || isPending) &&
									styles.primaryBtnDisabled,
							]}
							activeOpacity={isFriend || isPending ? 1 : 0.8}
							onPress={handlePrimaryAction}
							disabled={isActionLoading || isFriend || isPending}
						>
							{sending ? (
								<ActivityIndicator color="#fff" size="small" />
							) : (
								<Text style={styles.primaryBtnText}>
									{primaryLabel}
								</Text>
							)}
						</TouchableOpacity>

						{(isFriend || isPending) && (
							<TouchableOpacity
								style={styles.outlineBtn}
								activeOpacity={0.8}
								onPress={handleDeleteAction}
								disabled={isActionLoading}
							>
								{deleting ? (
									<ActivityIndicator
										color={ACCENT}
										size="small"
									/>
								) : (
									<Text style={styles.outlineBtnText}>
										Видалити
									</Text>
								)}
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleRow}>
							<Text style={styles.sectionTitle}>Альбоми</Text>
						</View>
						<TouchableOpacity activeOpacity={0.7}>
							<Text style={styles.sectionLink}>Дивитись всі</Text>
						</TouchableOpacity>
					</View>

					{albumsLoading ? (
						<ActivityIndicator
							color={ACCENT}
							style={{ marginTop: 16 }}
						/>
					) : (
						albums?.map((album) => {
							const cover = getAlbumCover(album);
							return (
								<View key={album.id} style={styles.albumCard}>
									<View style={styles.albumMeta}>
										<Text style={styles.albumName}>
											{album.name}
										</Text>
										{album.tag && (
											<Text style={styles.albumTag}>
												{album.tag}
												{album.year
													? `  ${album.year} рік`
													: ""}
											</Text>
										)}
									</View>
									{cover && (
										<Image
											source={cover}
											style={styles.albumCover}
											resizeMode="cover"
										/>
									)}
								</View>
							);
						})
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const ACCENT = "#543C52";
const TEXT_PRIMARY = "#1a1d2e";
const TEXT_SECONDARY = "#8a90a8";
const BG = "#f4f6fb";
const CARD_BG = "#ffffff";
const PLUM = "#543C52";

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: "white" },
	header: {
		width: "100%",
		alignItems: "flex-start",
	},
	backButton: {
		width: 36,
		height: 36,
		borderRadius: 12,
		backgroundColor: CARD_BG,
		alignItems: "center",
		justifyContent: "center",
	},
	backArrow: {
		fontSize: 26,
		color: TEXT_PRIMARY,
		lineHeight: 30,
		marginTop: -2,
	},
	scroll: { flex: 1 },
	scrollContent: { paddingHorizontal: 2, paddingBottom: 32, gap: 12 },
	profileCard: {
		backgroundColor: CARD_BG,
		borderRadius: 24,
		paddingVertical: 20,
		paddingHorizontal: 20,
		alignItems: "center",
		borderColor: COLOURS.Gray,
		borderWidth: 1,
	},
	avatarWrapper: {
		width: 94,
		height: 94,
		borderRadius: 1002,
		padding: 3,
		backgroundColor: CARD_BG,
		marginBottom: 14,
	},
	avatar: {
		width: 88,
		height: 88,
		borderRadius: 100,
		backgroundColor: "#dde0f0",
	},
	displayName: {
		fontSize: 20,
		fontWeight: "700",
		color: COLOURS.darkBlue,
		letterSpacing: -0.3,
		marginBottom: 4,
	},
	username: { fontSize: 15, color: COLOURS.darkBlue, marginBottom: 22 },
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		justifyContent: "center",
		marginBottom: 22,
	},
	statItem: { flex: 1, alignItems: "center", gap: 2 },
	statValue: {
		fontSize: 18,
		fontWeight: "700",
		color: TEXT_PRIMARY,
		letterSpacing: -0.5,
	},
	statLabel: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: "500" },
	statDivider: { width: 1, height: 32, backgroundColor: COLOURS.Blue20 },
	buttonsRow: { flexDirection: "row", gap: 10, width: "62%" },
	primaryBtn: {
		flex: 1,
		backgroundColor: PLUM,
		borderRadius: 70,
		paddingVertical: 11,
		alignItems: "center",
	},
	primaryBtnDisabled: { backgroundColor: "#9b8a9b" },
	primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
	outlineBtn: {
		flex: 1,
		backgroundColor: CARD_BG,
		borderRadius: 70,
		paddingVertical: 11,
		alignItems: "center",
		borderWidth: 1.3,
		borderColor: COLOURS.Plum,
	},
	outlineBtnText: { color: TEXT_PRIMARY, fontWeight: "600", fontSize: 14 },
	section: {
		backgroundColor: CARD_BG,
		borderRadius: 24,
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
	sectionTitle: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY },
	sectionLink: { fontSize: 13, color: PLUM, fontWeight: "500" },
	albumCard: { marginBottom: 16 },
	albumMeta: { marginBottom: 8 },
	albumName: {
		fontSize: 14,
		fontWeight: "600",
		color: TEXT_PRIMARY,
		marginBottom: 2,
	},
	albumTag: { fontSize: 12, color: TEXT_SECONDARY },
	albumCover: {
		width: "100%",
		height: 180,
		borderRadius: 16,
		backgroundColor: "#dde0f0",
	},
});
