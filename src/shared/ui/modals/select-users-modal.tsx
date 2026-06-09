import React, { useState, useMemo, useRef } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable,
	Animated,
	Image,
} from "react-native";
import { groupUsersByAlphabet } from "../../lib/group-by-alphabet";
import { COLOURS } from "@shared/constants/colours";
import { Button } from "@shared/ui/button";
import { IMAGES } from "@shared/ui/images";
import { SearchInput } from "../searchInput/searchInput";
import { CustomCheckboxRow } from "../custom-checkbox-row/custom-checkbox-row";
import { IUser } from "@modules/friends/api/friend.types";
import { BASE_URL } from "@shared/config/api.config";

interface SelectUsersModalProps {
	visible: boolean;
	onClose: () => void;
	users: IUser[];
	onSave: (selectedIds: string[]) => void;
	title: string;
	buttonText: string;
}

function resolveAvatar(avatar: string | null | undefined): string | null {
	if (!avatar) return null;
	if (avatar.startsWith("http"))
		return avatar.replace(/^https?:\/\/[^/]+/, BASE_URL);
	const filename = avatar.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}

const UserItem = React.memo(
	({
		item,
		isSelected,
		onToggle,
	}: {
		item: IUser;
		isSelected: boolean;
		onToggle: (id: string) => void;
	}) => {
		const avatarUri = resolveAvatar(item.profile?.avatar);

		return (
			<TouchableOpacity
				style={styles.userRow}
				activeOpacity={0.7}
				onPress={() => onToggle(item.id)}
			>
				<View style={styles.avatarContainer}>
					{avatarUri ? (
						<Image
							source={{ uri: avatarUri }}
							style={styles.avatarPlaceholder}
						/>
					) : (
						<View style={styles.avatarPlaceholder}>
							<Text style={styles.avatarText}>
								{(item.firstName ?? item.username ?? "?")
									.charAt(0)
									.toUpperCase()}
							</Text>
						</View>
					)}
					<View
						style={[
							styles.statusIndicator,
							{ backgroundColor: COLOURS.Gray },
						]}
					/>
				</View>
				<Text style={styles.userName}>
					{item.firstName} {item.lastName}
				</Text>
				<CustomCheckboxRow
					isSelected={isSelected}
					label=""
					onPress={() => onToggle(item.id)}
					isEditing={true}
				/>
			</TouchableOpacity>
		);
	},
	(prevProps, nextProps) => prevProps.isSelected === nextProps.isSelected,
);

export function SelectUsersModal({
	visible,
	onClose,
	users,
	onSave,
	title,
	buttonText,
}: SelectUsersModalProps) {
	const [search, setSearch] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const [contentHeight, setContentHeight] = useState(1);
	const [containerHeight, setContainerHeight] = useState(1);
	const scrollY = useRef(new Animated.Value(0)).current;

	const groupedUsers = useMemo(
		() => groupUsersByAlphabet(users, search),
		[users, search],
	);

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const safeContentHeight = Math.max(contentHeight, 1);
	const safeContainerHeight = Math.max(containerHeight, 1);

	let indicatorHeight = Math.max(
		(safeContainerHeight / safeContentHeight) * safeContainerHeight,
		30,
	);
	if (indicatorHeight > safeContainerHeight)
		indicatorHeight = safeContainerHeight;

	const indicatorTravel = safeContainerHeight - indicatorHeight;
	const contentTravel = safeContentHeight - safeContainerHeight;

	const indicatorTranslateY = scrollY.interpolate({
		inputRange: [0, contentTravel > 0 ? contentTravel : 1],
		outputRange: [0, indicatorTravel > 0 ? indicatorTravel : 0],
		extrapolate: "clamp",
	});

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent={true}
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.modalContent} onPress={() => {}}>
					<View style={styles.header}>
						<Text style={styles.title}>{title}</Text>
						<TouchableOpacity
							onPress={onClose}
							style={styles.closeBtn}
						>
							<IMAGES.XButton style={{ width: 20, height: 20 }} />
						</TouchableOpacity>
					</View>

					<SearchInput
						value={search}
						onChangeText={setSearch}
						placeholder="Пошук"
					/>

					<Text style={styles.selectedCount}>
						Вибрано: {selectedIds.length}
					</Text>

					<View style={styles.listWrapper}>
						<Animated.SectionList
							style={{ flex: 1 }}
							sections={groupedUsers}
							keyExtractor={(item) => item.id.toString()}
							showsVerticalScrollIndicator={false}
							onContentSizeChange={(_, h) => setContentHeight(h)}
							onLayout={(e) =>
								setContainerHeight(e.nativeEvent.layout.height)
							}
							onScroll={Animated.event(
								[
									{
										nativeEvent: {
											contentOffset: { y: scrollY },
										},
									},
								],
								{ useNativeDriver: false },
							)}
							scrollEventThrottle={16}
							contentContainerStyle={styles.listContent}
							renderSectionHeader={({ section: { title } }) => (
								<View style={styles.sectionHeaderContainer}>
									<Text style={styles.sectionHeader}>
										{title}
									</Text>
								</View>
							)}
							renderItem={({ item }) => (
								<UserItem
									item={item}
									isSelected={selectedIds.includes(item.id)}
									onToggle={toggleSelect}
								/>
							)}
						/>

						<View style={styles.customScrollBarTrack}>
							<Animated.View
								style={[
									styles.customScrollBarThumb,
									{
										height: indicatorHeight,
										transform: [
											{ translateY: indicatorTranslateY },
										],
									},
								]}
							/>
						</View>
					</View>

					<View style={styles.footer}>
						<Button
							title="Скасувати"
							variant="outline"
							onPress={onClose}
							style={styles.cancelBtn}
							textStyle={styles.cancelBtnText}
						/>
						<Button
							title={buttonText}
							variant="primary"
							onPress={() => onSave(selectedIds)}
							style={styles.saveBtn}
							textStyle={styles.saveBtnText}
						/>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	modalContent: {
		width: "100%",
		maxWidth: 400,
		height: "95%",
		backgroundColor: COLOURS.white,
		borderRadius: 25,
		padding: 20,
		elevation: 10,
		shadowColor: COLOURS.Black,
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
	},
	header: {
		position: "relative",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		marginTop: 20,
	},
	title: {
		marginTop: 20,
		fontSize: 34,
		fontFamily: "Wals-Medium",
		color: COLOURS.darkBlue,
	},
	closeBtn: {
		position: "absolute",
		right: 5,
		top: -10,
	},
	selectedCount: {
		color: COLOURS.Gray50,
		fontSize: 14,
		fontFamily: "Wals-Medium",
		marginTop: 20,
		marginBottom: 10,
	},
	listWrapper: {
		flex: 1,
		flexDirection: "row",
	},
	listContent: {
		paddingBottom: 20,
		paddingRight: 10,
	},
	customScrollBarTrack: {
		width: 6,
		backgroundColor: COLOURS.Plum50,
		borderRadius: 3,
		marginLeft: 5,
	},
	customScrollBarThumb: {
		width: 6,
		backgroundColor: COLOURS.Plum,
		borderRadius: 3,
	},
	sectionHeaderContainer: {
		backgroundColor: COLOURS.white,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderColor: COLOURS.Plum50,
	},
	sectionHeader: {
		fontFamily: "Wals-Medium",
		fontSize: 12,
		color: COLOURS.darkBlue,
	},
	userRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderColor: COLOURS.Plum50,
	},
	avatarContainer: {
		position: "relative",
		marginRight: 16,
	},
	avatarPlaceholder: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: COLOURS.Plum,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		color: COLOURS.white,
		fontSize: 16,
		fontFamily: "Wals-Medium",
	},
	statusIndicator: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: COLOURS.white,
	},
	userName: {
		flex: 1,
		fontSize: 16,
		fontFamily: "Wals-Medium",
		color: COLOURS.Black,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 15,
		paddingTop: 15,
	},
	cancelBtn: {
		flex: 0.3,
		width: "auto",
		alignSelf: "center",
		paddingHorizontal: 20,
		paddingVertical: 12,
		marginRight: 12,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: COLOURS.Plum,
		backgroundColor: COLOURS.white,
	},
	cancelBtnText: {
		fontSize: 14,
		fontFamily: "Wals-Medium",
		color: COLOURS.Plum,
	},
	saveBtn: {
		flex: 0.2,
		width: "auto",
		alignSelf: "center",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 24,
		backgroundColor: COLOURS.Plum,
	},
	saveBtnDisabled: {
		opacity: 0.5,
	},
	saveBtnText: {
		fontSize: 14,
		fontFamily: "Wals-Medium",
		color: COLOURS.white,
	},
});
