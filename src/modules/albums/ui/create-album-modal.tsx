import React from "react";
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	createAlbumSchema,
	CreateAlbumFormData,
} from "../../lib/albums/album.schema";

interface CreateAlbumModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSave: (data: {
		name: string;
		tag?: string;
		year?: number;
		visibility: "public" | "private";
	}) => void;
}

export const CreateAlbumModal = ({
	isVisible,
	onClose,
	onSave,
}: CreateAlbumModalProps) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAlbumFormData>({
		resolver: yupResolver(createAlbumSchema) as any,
		defaultValues: { name: "", tag: null, year: null },
	});

	const handleSave = handleSubmit((data) => {
		onSave({
			name: data.name,
			tag: data.tag ?? undefined,
			year: data.year ?? undefined,
			visibility: "public",
		});
		reset();
	});

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={handleClose}
		>
			<TouchableWithoutFeedback onPress={handleClose}>
				<View style={styles.overlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.keyboardView}
					>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={handleClose}
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
									<Controller
										control={control}
										name="name"
										render={({
											field: { onChange, value },
										}) => (
											<TextInput
												style={[
													styles.input,
													errors.name &&
														styles.inputError,
												]}
												placeholder="Настрій"
												placeholderTextColor={
													COLOURS.Gray50
												}
												value={value}
												onChangeText={onChange}
											/>
										)}
									/>
									{errors.name && (
										<Text style={styles.errorText}>
											{errors.name.message}
										</Text>
									)}
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>Тег</Text>
									<Controller
										control={control}
										name="tag"
										render={({
											field: { onChange, value },
										}) => (
											<TextInput
												style={[
													styles.input,
													errors.tag &&
														styles.inputError,
												]}
												placeholder="Природа"
												placeholderTextColor={
													COLOURS.Gray50
												}
												onChangeText={onChange}
											/>
										)}
									/>
									{errors.tag && (
										<Text style={styles.errorText}>
											{errors.tag.message}
										</Text>
									)}
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>
										Рік альбому
									</Text>
									<Controller
										control={control}
										name="year"
										render={({
											field: { onChange, value },
										}) => (
											<TextInput
												style={[
													styles.input,
													errors.year &&
														styles.inputError,
												]}
												placeholder="2024"
												placeholderTextColor={
													COLOURS.Gray50
												}
												value={value?.toString() ?? ""}
												onChangeText={(v) =>
													onChange(
														v
															? Number(v)
															: undefined,
													)
												}
												keyboardType="numeric"
												maxLength={4}
											/>
										)}
									/>
									{errors.year && (
										<Text style={styles.errorText}>
											{errors.year.message}
										</Text>
									)}
								</View>

								<View style={styles.footer}>
									<TouchableOpacity
										style={[
											styles.button,
											styles.cancelButton,
										]}
										onPress={handleClose}
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
	inputError: {
		borderColor: "#E53935",
	},
	errorText: {
		color: "#E53935",
		fontSize: 12,
		marginTop: 4,
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
