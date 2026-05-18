import React, { useState } from "react";
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
	useAcceptActionMutation,
	useDeleteActionMutation,
	useGetAllFriendsQuery,
	useGetRequestsQuery,
	useSendRequestMutation,
} from "@modules/friends/api/friend.api";
import { useGetUserPostsQuery } from "@modules/post/api/post.api";
import { useGetMeQuery } from "@modules/auth/api/user-api";
import { Post } from "@modules/post/ui/post";
import { Header } from "@shared/ui/header";
import { GalleryButton } from "@shared/ui/images/_images/buttonIcons/galleryButton";
import { PenButton } from "@shared/ui/images/_images/buttonIcons/penButton";
import { Footer } from "@shared/ui/footer";
import { BackButton } from "@shared/ui/images/_images/buttonIcons/backButton";

const ACCENT = "#543C52";
const TEXT_PRIMARY = "#1a1d2e";
const TEXT_SECONDARY = "#8a90a8";
const CARD_BG = "#ffffff";
const PLUM = "#543C52";

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

	const [requestSent, setRequestSent] = useState(false);

	const { data: me } = useGetMeQuery();

	const { data: user, isLoading: userLoading } = useGetUserByIdQuery(
		Number(userId),
		{ skip: !userId },
	);

	const { data: albums, isLoading: albumsLoading } =
		useGetAlbumsByUserIdQuery(Number(userId), { skip: !userId });

	const { data: userPosts, isLoading: postsLoading } = useGetUserPostsQuery(
		{ userId: Number(userId), page: 1, limit: 1 },
		{ skip: !userId },
	);

	const { data: allFriends } = useGetAllFriendsQuery();
	const { data: requests } = useGetRequestsQuery();

	const [sendRequest, { isLoading: sending }] = useSendRequestMutation();
	const [acceptAction, { isLoading: accepting }] = useAcceptActionMutation();
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
	const iSentRequest = pendingRequest?.fromProfileRel?.id === me?.id;

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
		const image = album?.images?.[0]?.image;
		if (!image) return null;
		const url =
			image.normalImageURL ??
			image.shakalImageURL ??
			(image.pathname
				? `${BASE_URL}/media/shakal/${image.pathname}`
				: null);
		return url ? { uri: url } : null;
	};

	const customAlbums = albums
		?.filter((a: any) => a.type === "custom")
		.slice(0, 1);

	const handlePrimaryAction = async () => {
		if (isFriend || isPending) return;
		try {
			await sendRequest({ targetUserId: Number(userId) }).unwrap();
			setRequestSent(true);
		} catch (e) {}
	};

	const handleConfirmAction = async () => {
		const id = pendingRequest?.id;
		if (!id) return;
		try {
			await acceptAction({ id, type: "request" }).unwrap();
		} catch (e) {}
	};

	const handleDeleteAction = async () => {
		const id = friendship?.id ?? pendingRequest?.id;
		if (!id) return;
		try {
			await deleteAction({
				id,
				type: isPending ? "request" : undefined,
			}).unwrap();
		} catch (e) {}
	};

	const isActionLoading = sending || deleting || accepting;

	if (userLoading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<ActivityIndicator style={{ marginTop: 32 }} color={ACCENT} />
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.safeArea}>
			<Header showLogoutButton />
			<StatusBar barStyle="dark-content" />

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.profileCard}>
					<View style={styles.cardTopRow}>
						<TouchableOpacity
							onPress={() => router.back()}
							activeOpacity={0.7}
						>
							<BackButton />
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
						<StatItem
							value={String(userPosts?.meta?.total ?? 0)}
							label="Дописи"
						/>
						<View style={styles.statDivider} />
						<StatItem value="0" label="Читачі" />
						<View style={styles.statDivider} />
						<StatItem value="0" label="Друзі" />
					</View>

					<View style={styles.buttonsRow}>
						{!isFriend && !isPending && (
							<>
								<TouchableOpacity
									style={[
										styles.primaryBtn,
										requestSent && {
											backgroundColor: "#9b8a9b",
										},
									]}
									activeOpacity={requestSent ? 1 : 0.8}
									onPress={
										requestSent
											? undefined
											: handlePrimaryAction
									}
									disabled={isActionLoading || requestSent}
								>
									{sending ? (
										<ActivityIndicator
											color="#fff"
											size="small"
										/>
									) : (
										<Text
											style={styles.primaryBtnText}
											numberOfLines={1}
											adjustsFontSizeToFit
										>
											{requestSent
												? "Запит надіслано"
												: "Додати в друзі"}
										</Text>
									)}
								</TouchableOpacity>
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
							</>
						)}

						{isPending && (
							<>
								{iSentRequest ? (
									<TouchableOpacity
										style={[
											styles.primaryBtn,
											{ backgroundColor: "#9b8a9b" },
										]}
										activeOpacity={1}
										disabled
									>
										<Text style={styles.primaryBtnText}>
											Запит надіслано
										</Text>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										style={styles.primaryBtn}
										activeOpacity={0.8}
										onPress={handleConfirmAction}
										disabled={isActionLoading}
									>
										{accepting ? (
											<ActivityIndicator
												color="#fff"
												size="small"
											/>
										) : (
											<Text style={styles.primaryBtnText}>
												Підтвердити
											</Text>
										)}
									</TouchableOpacity>
								)}
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
							</>
						)}

						{isFriend && (
							<>
								<TouchableOpacity
									style={styles.primaryBtnDisabledFriend}
									activeOpacity={1}
								>
									<Text style={styles.primaryBtnText}>
										Друзі
									</Text>
								</TouchableOpacity>
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
							</>
						)}
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleRow}>
							<GalleryButton
								tintColor="#8a90a8"
								style={{ width: 20, height: 18 }}
							/>
							<Text style={styles.sectionTitle}>Альбоми</Text>
						</View>
						{!!customAlbums?.length && (
							<TouchableOpacity activeOpacity={0.7}>
								<Text style={styles.sectionLink}>
									Дивитись всі
								</Text>
							</TouchableOpacity>
						)}
					</View>
					<View
						style={{
							height: 1,
							backgroundColor: "#c7cbd2",
							width: "100%",
							marginBottom: 16,
						}}
					/>

					{albumsLoading ? (
						<ActivityIndicator
							color={ACCENT}
							style={{ marginTop: 16 }}
						/>
					) : !customAlbums?.length ? (
						<Text style={styles.emptyText}>
							Користувач немає альбомів
						</Text>
					) : (
						customAlbums.map((album: any) => {
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
												<Text style={styles.albumYear}>
													{album.year
														? `  ${album.year} рік`
														: ""}
												</Text>
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

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleRow}>
							<PenButton
								tintColor="#8a90a8"
								style={{ width: 20, height: 20 }}
							/>
							<Text style={styles.sectionTitle}>Дописи</Text>
						</View>
						{!!userPosts?.data?.length && (
							<TouchableOpacity activeOpacity={0.7}>
								<Text style={styles.sectionLink}>
									Дивитись всі
								</Text>
							</TouchableOpacity>
						)}
					</View>
					<View
						style={{
							height: 1,
							backgroundColor: "#c7cbd2",
							width: "100%",
							marginBottom: 16,
						}}
					/>

					{postsLoading ? (
						<ActivityIndicator
							color={ACCENT}
							style={{ marginTop: 16 }}
						/>
					) : !userPosts?.data?.length ? (
						<Text style={styles.emptyText}>
							Користувач немає дописів
						</Text>
					) : (
						userPosts.data.map((post) => (
							<View
								key={post.id}
								style={{
									marginHorizontal: -16,
									shadowOpacity: 0,
									elevation: 0,
								}}
							>
								<Post post={post} />
							</View>
						))
					)}
				</View>
			</ScrollView>
			<Footer />
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: "white" },
	scroll: { flex: 1 },
	scrollContent: { paddingHorizontal: 2, paddingBottom: 32, gap: 7 },
	profileCard: {
		backgroundColor: CARD_BG,
		borderRadius: 10,
		paddingVertical: 20,
		paddingHorizontal: 20,
		alignItems: "center",
		borderColor: COLOURS.Gray,
		borderWidth: 1,
	},
	cardTopRow: {
		width: "100%",
		alignItems: "flex-start",
		marginBottom: 12,
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
	buttonsRow: { flexDirection: "row", gap: 10, width: "75%" },
	primaryBtn: {
		flex: 1,
		backgroundColor: PLUM,
		borderRadius: 70,
		paddingVertical: 11,
		alignItems: "center",
	},
	primaryBtnDisabledFriend: {
		flex: 1,
		backgroundColor: "#9b8a9b",
		borderRadius: 70,
		paddingVertical: 11,
		alignItems: "center",
	},
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
		borderRadius: 10,
		paddingVertical: 20,
		paddingHorizontal: 16,
		borderColor: COLOURS.Gray,
		borderWidth: 1,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
	sectionTitle: { fontSize: 16, fontWeight: "500", color: COLOURS.Gray50 },
	sectionLink: { fontSize: 13, color: PLUM, fontWeight: "500" },
	emptyText: {
		fontSize: 13,
		color: TEXT_SECONDARY,
		textAlign: "center",
		paddingVertical: 12,
	},
	albumCard: { marginBottom: 16 },
	albumMeta: { marginBottom: 8 },
	albumName: {
		fontSize: 16,
		fontWeight: "500",
		color: COLOURS.darkBlue,
		marginBottom: 5,
	},
	albumTag: { fontSize: 16, color: COLOURS.darkBlue },
	albumYear: { fontSize: 14, color: COLOURS.Gray50, paddingLeft: 15 },
	albumCover: {
		width: "100%",
		height: 180,
		borderRadius: 16,
		backgroundColor: "#dde0f0",
	},
});
