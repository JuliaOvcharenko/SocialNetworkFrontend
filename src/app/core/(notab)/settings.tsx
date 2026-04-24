import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from 'expo-image-picker';

import { settingsSchema, SettingsFormData } from "@modules/lib/settings/settings.schema";
import { SectionHeader } from "@modules/settings/ui/section-header";
import { ProfileCard } from "@modules/settings/ui/profile-card";
import { PersonalDataForm } from "@modules/settings/ui/personal-data-form";
import { SignatureVariants } from "@modules/settings/ui/signature-variants";
import { PasswordForm } from "@modules/settings/ui/password-form";

import { useGetMeQuery, useUploadAvatarMutation } from "@modules/auth/api/user-api";
import { BASE_URL } from "@shared/config/api.config";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

    const [activeTab, setActiveTab] = useState<"personal" | "albums">("personal");
    const [avatarUri, setAvatarUri] = useState<string | null>(null);


    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingSignature, setIsEditingSignature] = useState(false);

    const [isAliasSelected, setIsAliasSelected] = useState(true);
    const [isElectronicSelected, setIsElectronicSelected] = useState(true);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const Router = useRouter();

    const { control, trigger, formState: { errors }, watch, reset } = useForm<SettingsFormData>({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            name: '',
            surname: '',
            nickname: '',
            authorAlias: '',
            birthDate: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                authorAlias: user.authorAlias || `${user.name || ''} ${user.surname || ''}`.trim() || '',
                nickname: user.nickname ? (user.nickname.startsWith('@') ? user.nickname : `@${user.nickname}`) : '',
                birthDate: user.birthDate || '',
                password: '*********',
            });

            if (user.avatars && user.avatars.length > 0) {
                const mainAvatar = user.avatars.find(a => a.isActive);
                if (mainAvatar) {
                    setAvatarUri(`${BASE_URL}${mainAvatar.image.shakalImageURL}`);
                }
            }
        }
    }, [user, reset]);

    const currentAuthorFullName = watch("authorAlias");

    const pickAvatarImage = async (isReplace: boolean, avatarId?: number) => {
        if (!isEditingProfile || isUploading) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled || !result.assets) return;

        const imageUri = result.assets[0].uri;
        const fileUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
        const filename = imageUri.split('/').pop() || 'avatar.jpg';

        const formData = new FormData();

        const fileToUpload = {
            uri: fileUri,
            name: filename,
            type: 'image/jpeg',
        };

        // @ts-ignore
        formData.append('avatar', fileToUpload);

        if (isReplace && avatarId) {
            formData.append('avatarId', String(avatarId));
        }

        try {
            await uploadAvatar({
                formData,
                isMain: !isReplace
            }).unwrap();
        } catch (e) {
            console.error("Помилка завантаження:", e);
        }
    };

    const handleReplacePhoto = () => {
        if (isUploading) return;

        const currentAvatarId = user?.avatars?.[activeIndex]?.id;
        if (currentAvatarId) {
            pickAvatarImage(true, currentAvatarId);
        }
    };
    const handleProfileEditToggle = async () => {
        if (isEditingProfile) {
            const isValid = await trigger(["authorAlias", "nickname"]);
            if (isValid) setIsEditingProfile(false);
        } else setIsEditingProfile(true);
    };

    const handlePersonalEditToggle = async () => {
        if (isEditingPersonal) {
            const isValid = await trigger(["name", "surname", "birthDate", "email"]);
            if (isValid) setIsEditingPersonal(false);
        } else setIsEditingPersonal(true);
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
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLOURS.Plum} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <Header showSettingsButton showCreateButton showLogoutButton />

                 <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("personal")}>
                        <Text style={[styles.tabText, activeTab === "personal" && styles.tabTextActive]}>Особиста інформація</Text>
                        {activeTab === "personal" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => Router.push('/core/albums')}>
                        <Text style={[styles.tabText, activeTab === "albums" && styles.tabTextActive]}>Альбоми</Text>
                        {activeTab === "albums" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                </View>

                {activeTab === "personal" && (
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                            <View style={[styles.section, isEditingProfile && { borderColor: COLOURS.Plum }]}>
                                <SectionHeader
                                    title="Картка профілю"
                                    isEditing={isEditingProfile}
                                    onEditPress={handleProfileEditToggle}
                                />
                                <ProfileCard
                                    avatars={user?.avatars || []}
                                    onIndexChange={(index) => setActiveIndex(index)}

                                    onAddPhoto={() => pickAvatarImage(false)}
                                    onReplacePhoto={handleReplacePhoto}

                                    control={control}
                                    isEditing={isEditingProfile}
                                    authorFullName={
                                        user?.authorAlias ? user?.authorAlias : `@${user?.nickname}`
                                    } usernameView={user?.nickname ? `@${user?.nickname}` : ""}
                                />
                            </View>

                            <View style={[styles.section, { paddingBottom: 0 }, isEditingPersonal && { borderColor: COLOURS.Plum }]}>
                                <SectionHeader
                                    title="Особиста інформація"
                                    isEditing={isEditingPersonal}
                                    onEditPress={handlePersonalEditToggle}
                                />
                                <PersonalDataForm control={control} errors={errors} isEditing={isEditingPersonal} />

                                <View style={[styles.innerPasswordBox, isEditingPassword && styles.innerPasswordBoxEditing]}>
                                    <SectionHeader
                                        title="Пароль"
                                        isEditing={isEditingPassword}
                                        onEditPress={handlePasswordEditToggle}
                                    />
                                    <PasswordForm control={control} errors={errors} isEditing={isEditingPassword} />
                                </View>
                            </View>

                            <View style={[styles.section, { paddingBottom: 0 }, isEditingSignature && { borderColor: COLOURS.Plum }]}>
                                <SectionHeader
                                    title="Варіанти підпису"
                                    isEditing={isEditingSignature}
                                    onEditPress={handleSignatureEditToggle}
                                />
                                <SignatureVariants
                                    isEditing={isEditingSignature}
                                    isAliasSelected={isAliasSelected}
                                    onAliasToggle={() => setIsAliasSelected(!isAliasSelected)}
                                    isElectronicSelected={isElectronicSelected}
                                    onElectronicToggle={() => setIsElectronicSelected(!isElectronicSelected)}
                                    signatureImageUri={signatureImage}
                                    onSignatureImageChange={setSignatureImage}
                                    authorAlias={currentAuthorFullName || "Ім'я не вказано"}
                                />
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                )}
                {activeTab === "albums" && <View style={styles.content}><Text>Тут будуть Альбоми</Text></View>}
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
        paddingBottom: 6
    },
    tab: {
        marginRight: 24,
        paddingVertical: 5,
        position: "relative"
    },
    tabText: {
        fontSize: 16,
        color: COLOURS.Gray50
    },
    tabTextActive: {
        color: COLOURS.darkBlue,
        fontWeight: "700"
    },
    indicator: {
        position: "absolute",
        bottom: -1, left: 0, right: 0,
        height: 2, backgroundColor: COLOURS.darkBlue, borderRadius: 1
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
    }
});