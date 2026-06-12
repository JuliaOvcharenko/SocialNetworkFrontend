import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
			<TouchableOpacity
				style={styles.overlay}
				onPress={onClose}
				activeOpacity={1}
			>
				<View style={styles.modal}>
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
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "transparent",
		justifyContent: "flex-start",
		alignItems: "flex-end",
		paddingTop: 60,
		paddingRight: 12,
	},
	modal: {
		backgroundColor: COLOURS.Plum50,
		borderRadius: 14,
		paddingVertical: 6,
		minWidth: 200,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	action: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		gap: 12,
	},
	icon: {
		width: 24,
		alignItems: "center",
	},
	text: {
		fontSize: 16,
		fontWeight: "500",
		color: "#1B1A2A",
	},
	dangerText: {
		color: "#E53935",
	},
	divider: {
		height: 1,
		backgroundColor: "#D8D2DF",
		marginHorizontal: 12,
	},
});
