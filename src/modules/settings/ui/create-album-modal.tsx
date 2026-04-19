import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Ionicons } from "@expo/vector-icons";

interface CreateAlbumModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSave: (data: { name: string; theme: string; year: string }) => void;
}

export const CreateAlbumModal = ({
	isVisible,
	onClose,
	onSave,
}: CreateAlbumModalProps) => {
	const [name, setName] = useState("");
	const [theme, setTheme] = useState("Природа");
	const [year, setYear] = useState("");

	const handleSave = () => {
		onSave({ name, theme, year });
		setName("");
		setYear("");
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.overlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.keyboardView}
					>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={onClose}
									hitSlop={{
										top: 10,
										bottom: 10,
										left: 10,
										right: 10,
									}}
								>
									<Ionicons
										name="close"
										size={24}
										color={COLOURS.darkBlue}
									/>
								</TouchableOpacity>

								<Text style={styles.title}>
									Створити альбом
								</Text>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>
										Назва альбому
									</Text>
									<TextInput
										style={styles.input}
										placeholder="Настрій"
										placeholderTextColor={COLOURS.Gray50}
										value={name}
										onChangeText={setName}
									/>
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>
										Оберіть тему
									</Text>
									<TouchableOpacity
										style={styles.dropdown}
										activeOpacity={0.7}
									>
										<Text style={styles.dropdownText}>
											{theme}
										</Text>
										<Ionicons
											name="chevron-down"
											size={20}
											color={COLOURS.Gray50}
										/>
									</TouchableOpacity>
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>
										Рік альбому
									</Text>
									<TouchableOpacity
										style={styles.dropdown}
										activeOpacity={0.7}
									>
										<Text
											style={
												year
													? styles.dropdownText
													: styles.placeholderText
											}
										>
											{year || "Оберіть рік"}
										</Text>
										<Ionicons
											name="chevron-down"
											size={20}
											color={COLOURS.Gray50}
										/>
									</TouchableOpacity>
								</View>

								<View style={styles.footer}>
									<TouchableOpacity
										style={[
											styles.button,
											styles.cancelButton,
										]}
										onPress={onClose}
									>
										<Text style={styles.cancelButtonText}>
											Скасувати
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={[
											styles.button,
											styles.saveButton,
										]}
										onPress={handleSave}
									>
										<Text style={styles.saveButtonText}>
											Зберегти
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "center",
		alignItems: "center",
	},
	keyboardView: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	modalContainer: {
		width: "92%",
		maxWidth: 400,
		backgroundColor: COLOURS.white,
		borderRadius: 32,
		paddingHorizontal: 24,
		paddingVertical: 32,
		paddingTop: 44,
		position: "relative",
		elevation: 5,
		shadowColor: COLOURS.Black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
	},
	closeButton: {
		position: "absolute",
		top: 20,
		right: 20,
		zIndex: 10,
	},
	title: {
		fontSize: 26,
		fontWeight: "700",
		color: COLOURS.darkBlue,
		textAlign: "left",
		width: "100%",
		marginBottom: 28,
	},
	inputGroup: {
		marginBottom: 16,
		width: "100%",
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: COLOURS.darkBlue,
		marginBottom: 8,
	},
	input: {
		height: 52,
		borderWidth: 1,
		borderColor: COLOURS.Blue20,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		color: COLOURS.darkBlue,
	},
	dropdown: {
		height: 52,
		borderWidth: 1,
		borderColor: COLOURS.Blue20,
		borderRadius: 12,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	dropdownText: {
		fontSize: 16,
		color: COLOURS.darkBlue,
	},
	placeholderText: {
		fontSize: 16,
		color: COLOURS.Gray50,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 16,
		gap: 12,
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 24,
		minWidth: 110,
		alignItems: "center",
	},
	cancelButton: {
		borderWidth: 1,
		borderColor: COLOURS.Plum,
	},
	saveButton: {
		backgroundColor: COLOURS.Plum,
	},
	cancelButtonText: {
		color: COLOURS.Plum,
		fontSize: 16,
		fontWeight: "700",
	},
	saveButtonText: {
		color: COLOURS.white,
		fontSize: 16,
		fontWeight: "700",
	},
});
