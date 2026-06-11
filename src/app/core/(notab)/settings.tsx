import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";

import {
	settingsSchema,
	SettingsFormData,
} from "@modules/lib/settings/settings.schema";
import { SectionHeader } from "@modules/settings/ui/section-header";
import { ProfileCard } from "@modules/settings/ui/profile-card";
import { PersonalDataForm } from "@modules/settings/ui/personal-data-form";
import { SignatureVariants } from "@modules/settings/ui/signature-variants";
import { PasswordForm } from "@modules/settings/ui/password-form";

import {
	useGetMeQuery,
	useUpdateProfileMutation,
	useUploadAvatarMutation,
} from "@modules/auth/api/user-api";
import { BASE_URL } from "@shared/config/api.config";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
	const { data: user, isLoading: isUserLoading } = useGetMeQuery();
	const [uploadAvatar, { isLoading: isUploading }] =
		useUploadAvatarMutation();

	const [activeTab, setActiveTab] = useState<"personal" | "albums">(
		"personal",
	);
	const [avatarUri, setAvatarUri] = useState<string | null>(null);

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingPassword, setIsEditingPassword] = useState(false);
	const [isEditingSignature, setIsEditingSignature] = useState(false);
	const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

	const [isAliasSelected, setIsAliasSelected] = useState(true);
	const [isElectronicSelected, setIsElectronicSelected] = useState(true);
	const [signatureImage, setSignatureImage] = useState<string | null>(null);

	const [activeIndex, setActiveIndex] = useState(0);

	const Router = useRouter();

	const {
		control,
		trigger,
		formState: { errors },
		watch,
		reset,
	} = useForm<SettingsFormData>({
		resolver: yupResolver(settingsSchema),
		defaultValues: {
			name: "",
			surname: "",
			nickname: "",
			authorAlias: "",
			birthDate: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (user) {
			reset({
				name: user.firstName || "",
				surname: user.lastName || "",
				email: user.email || "",
				authorAlias:
					user.profile?.pseudonym ||
					`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
					"",
				nickname: user.username
					? user.username.startsWith("@")
						? user.username
						: `@${user.username}`
					: "",
				birthDate: user.profile?.birthDate || "",
				password: "*********",
			});

			if (user.profile?.avatar) {
				setAvatarUri(`${BASE_URL}${user.profile.avatar}`);
			}
		}
	}, [user, reset]);

	const currentAuthorFullName = watch("authorAlias");

	const pickAvatarImage = async (isReplace: boolean) => {
		if (!isEditingProfile || isUploading) return;

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (result.canceled || !result.assets?.length) return;
		const asset = result.assets[0];
		if (!asset.uri) return;

		const formData = new FormData();
		formData.append("avatar", {
			uri: asset.uri,
			name: asset.fileName || "avatar.jpg",
			type: asset.mimeType || "image/jpeg",
		} as any);

		try {
			const res = await uploadAvatar({ formData, isMain: true }).unwrap();
			console.log("UPLOAD OK:", res);
		} catch (e) {
			console.log("UPLOAD FAIL:", e);
		}
	};

	const handleReplacePhoto = () => {
		if (isUploading) return;
		pickAvatarImage(true);
	};

	const handleProfileEditToggle = async () => {
		if (isEditingProfile) {
			const isValid = await trigger(["authorAlias", "nickname"]);
			if (!isValid) return;

			const values = watch();
			const cleanNickname = values.nickname?.replace("@", "") || "";

			try {
				await updateProfile({
					username: cleanNickname,
					pseudonym: values.authorAlias,
				}).unwrap();
				setIsEditingProfile(false);
			} catch (e) {
				console.log("UPDATE PROFILE FAIL:", e);
			}
		} else {
			setIsEditingProfile(true);
		}
	};

	const handlePersonalEditToggle = async () => {
		if (isEditingPersonal) {
			const isValid = await trigger([
				"name",
				"surname",
				"birthDate",
				"email",
			]);
			if (!isValid) return;

			const values = watch();

			try {
				await updateProfile({
					firstName: values.name,
					lastName: values.surname,
					birthDate: values.birthDate,
				}).unwrap();
				setIsEditingPersonal(false);
			} catch (e) {
				console.log("UPDATE PERSONAL FAIL:", e);
			}
		} else {
			setIsEditingPersonal(true);
		}
	};
	const handlePasswordEditToggle = async () => {
		if (isEditingPassword) {
			const isValid = await trigger(["password", "confirmPassword"]);
			if (isValid) setIsEditingPassword(false);
		} else setIsEditingPassword(true);
	};

	const handleSignatureEditToggle = () => {
		setIsEditingSignature(!isEditingSignature);
	};

	if (isUserLoading) {
		return (
			<View
				style={[
					styles.container,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color={COLOURS.Plum} />
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
			<View style={styles.container}>
				<Header showSettingsButton showCreateButton showLogoutButton />

				<View style={styles.tabsContainer}>
					<TouchableOpacity
						style={styles.tab}
						onPress={() => setActiveTab("personal")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "personal" &&
									styles.tabTextActive,
							]}
						>
							Особиста інформація
						</Text>
						{activeTab === "personal" && (
							<View style={styles.indicator} />
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.tab}
						onPress={() => Router.push("/core/albums")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "albums" && styles.tabTextActive,
							]}
						>
							Альбоми
						</Text>
						{activeTab === "albums" && (
							<View style={styles.indicator} />
						)}
					</TouchableOpacity>
				</View>

				{activeTab === "personal" && (
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}
						>
							<View
								style={[
									styles.section,
									isEditingProfile && {
										borderColor: COLOURS.Plum,
									},
								]}
							>
								<SectionHeader
									title="Картка профілю"
									isEditing={isEditingProfile}
									onEditPress={handleProfileEditToggle}
								/>
								<ProfileCard
									avatar={user?.profile?.avatar || null}
									onAddPhoto={() => pickAvatarImage(false)}
									onReplacePhoto={handleReplacePhoto}
									control={control}
									isEditing={isEditingProfile}
									authorFullName={
										user?.profile?.pseudonym ||
										`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
										""
									}
									usernameView={
										user?.username
											? `@${user.username}`
											: ""
									}
								/>
							</View>

							<View
								style={[
									styles.section,
									{ paddingBottom: 0 },
									isEditingPersonal && {
										borderColor: COLOURS.Plum,
									},
								]}
							>
								<SectionHeader
									title="Особиста інформація"
									isEditing={isEditingPersonal}
									onEditPress={handlePersonalEditToggle}
								/>
								<PersonalDataForm
									control={control}
									errors={errors}
									isEditing={isEditingPersonal}
								/>

								<View
									style={[
										styles.innerPasswordBox,
										isEditingPassword &&
											styles.innerPasswordBoxEditing,
									]}
								>
									<SectionHeader
										title="Пароль"
										isEditing={isEditingPassword}
										onEditPress={handlePasswordEditToggle}
									/>
									<PasswordForm
										control={control}
										errors={errors}
										isEditing={isEditingPassword}
									/>
								</View>
							</View>

							<View
								style={[
									styles.section,
									{ paddingBottom: 0 },
									isEditingSignature && {
										borderColor: COLOURS.Plum,
									},
								]}
							>
								<SectionHeader
									title="Варіанти підпису"
									isEditing={isEditingSignature}
									onEditPress={handleSignatureEditToggle}
								/>
								<SignatureVariants
									isEditing={isEditingSignature}
									isAliasSelected={isAliasSelected}
									onAliasToggle={() =>
										setIsAliasSelected(!isAliasSelected)
									}
									isElectronicSelected={isElectronicSelected}
									onElectronicToggle={() =>
										setIsElectronicSelected(
											!isElectronicSelected,
										)
									}
									signatureImageUri={signatureImage}
									onSignatureImageChange={setSignatureImage}
									authorAlias={
										currentAuthorFullName ||
										"Ім'я не вказано"
									}
								/>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				)}
				{activeTab === "albums" && (
					<View style={styles.content}>
						<Text>Тут будуть Альбоми</Text>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLOURS.Plum50 },
	tabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: COLOURS.Plum50,
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 6,
	},
	tab: {
		marginRight: 24,
		paddingVertical: 5,
		position: "relative",
	},
	tabText: {
		fontSize: 16,
		color: COLOURS.Gray50,
	},
	tabTextActive: {
		color: COLOURS.darkBlue,
		fontWeight: "700",
	},
	indicator: {
		position: "absolute",
		bottom: -1,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: COLOURS.darkBlue,
		borderRadius: 1,
	},
	content: { flex: 1, padding: 16 },
	scrollContent: { paddingBottom: 160, paddingTop: 16 },
	section: {
		backgroundColor: COLOURS.white,
		borderRadius: 24,
		padding: 20,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: COLOURS.Gray,
	},
	innerPasswordBox: {
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 16,
		marginHorizontal: -16,
		backgroundColor: COLOURS.white,
	},
	innerPasswordBoxEditing: {
		borderWidth: 1,
		borderColor: COLOURS.Plum,
	},
});
