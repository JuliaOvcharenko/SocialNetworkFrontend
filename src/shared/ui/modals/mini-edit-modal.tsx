import React from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOURS } from "@shared/constants/colours";

type ActionItem = {
	id: string;
	title: string;
	icon: React.ReactNode;
	danger?: boolean;
	onPress: () => void;
};

type Props = {
	visible: boolean;
	onClose: () => void;
	actions: ActionItem[];
};

export const ActionModal = ({ visible, onClose, actions }: Props) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.modal}>
					<TouchableOpacity style={styles.moreButton}>
						<Ionicons
							name="ellipsis-vertical"
							size={22}
							color="#8B8895"
						/>
					</TouchableOpacity>

					{actions.map((action, index) => (
						<View key={action.id}>
							<TouchableOpacity
								style={styles.action}
								activeOpacity={0.7}
								onPress={() => {
									action.onPress();
									onClose();
								}}
							>
								<View style={styles.icon}>{action.icon}</View>

								<Text
									style={[
										styles.text,
										action.danger && styles.dangerText,
									]}
								>
									{action.title}
								</Text>
							</TouchableOpacity>

							{index !== actions.length - 1 && (
								<View style={styles.divider} />
							)}
						</View>
					))}
				</Pressable>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		paddingHorizontal: 20,
	},

	modal: {
		backgroundColor: COLOURS.Plum50,
		borderRadius: 18,
		paddingTop: 18,
		paddingBottom: 10,
		overflow: "hidden",
	},

	moreButton: {
		position: "absolute",
		top: 14,
		right: 10,
		zIndex: 10,
		padding: 6,
	},

	action: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 22,
		paddingVertical: 20,
		gap: 16,
	},

	icon: {
		width: 26,
		alignItems: "center",
	},

	text: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1B1A2A",
	},

	dangerText: {
		color: "#1B1A2A",
	},

	divider: {
		height: 1,
		backgroundColor: "#D8D2DF",
		marginHorizontal: 20,
	},
});
