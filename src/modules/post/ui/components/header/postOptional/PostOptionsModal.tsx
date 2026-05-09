import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	StyleSheet,
	Alert,
} from "react-native";
import { useDeletePostMutation } from "@modules/post/api/post.api";

interface PostOptionsModalProps {
	visible: boolean;
	postId: number;
	onClose: () => void;
	onEdit: () => void;
}

export function PostOptionsModal({
	visible,
	postId,
	onClose,
	onEdit,
}: PostOptionsModalProps) {
	const [deletePost] = useDeletePostMutation();

	const handleDelete = async () => {
		onClose();
		Alert.alert("Видалити публікацію", "Ви впевнені?", [
			{ text: "Скасувати", style: "cancel" },
			{
				text: "Видалити",
				style: "destructive",
				onPress: async () => {
					const result = await deletePost(postId);
				},
			},
		]);
	};

	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableOpacity style={styles.overlay} onPress={onClose}>
				<View style={styles.menu}>
					<TouchableOpacity style={styles.option} onPress={onEdit}>
						<Text style={styles.optionText}>Редагувати допис</Text>
					</TouchableOpacity>

					<View style={styles.divider} />

					<TouchableOpacity
						style={styles.option}
						onPress={handleDelete}
					>
						<Text style={styles.optionText}>
							Видалити публікацію
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	menu: {
		backgroundColor: "#F2F2F7",
		borderRadius: 14,
		width: 220,
		overflow: "hidden",
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 14,
		paddingHorizontal: 18,
	},
	optionText: {
		fontSize: 16,
		color: "#222",
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: "#C6C6C8",
	},
});
