import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from 'expo-image-picker';

import { settingsSchema, SettingsFormData } from "@modules/lib/settings/settings.schema";
import { SectionHeader } from "@modules/settings/ui/section-header";
import { ProfileCard } from "@modules/settings/ui/profile-card";
import { PersonalDataForm } from "@modules/settings/ui/personal-data-form";
import { PasswordForm } from "@modules/settings/ui/password-form";
import { SignatureVariants } from "@modules/settings/ui/signature-variants";

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<"personal" | "albums">("personal");
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingSignature, setIsEditingSignature] = useState(false);

    const [isAliasSelected, setIsAliasSelected] = useState(true);
    const [isElectronicSelected, setIsElectronicSelected] = useState(true);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    const { control, trigger, formState: { errors } } = useForm<SettingsFormData>({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            firstName: 'Гость',
            lastName: 'Користувач',
            birthday: '01.01.2000',
            email: 'guest@example.com',
            password: 'guest1234',
        }
    });

    const pickAvatarImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    const handlePersonalEditToggle = async () => {
        if (isEditingPersonal) {
            const isValid = await trigger(["firstName", "lastName", "birthday", "email"]);
            if (isValid) setIsEditingPersonal(false);
        } else setIsEditingPersonal(true);
    };

    const handlePasswordEditToggle = async () => {
        if (isEditingPassword) {
            const isValid = await trigger(["password"]);
            if (isValid) setIsEditingPassword(false);
        } else setIsEditingPassword(true);
    };

    const handleSignatureEditToggle = () => {
        setIsEditingSignature(!isEditingSignature);
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <Header showSettingsButton showCreateButton showLogoutButton />

                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("personal")}>
                        <Text style={[styles.tabText, activeTab === "personal" && styles.tabTextActive]}>Особиста інформація</Text>
                        {activeTab === "personal" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("albums")}>
                        <Text style={[styles.tabText, activeTab === "albums" && styles.tabTextActive]}>Альбоми</Text>
                        {activeTab === "albums" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                </View>

                {activeTab === "personal" && (
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                            <View style={styles.section}>
                                <SectionHeader title="Картка профілю" onEditPress={pickAvatarImage} />
                                <ProfileCard avatarUri={avatarUri} fullName="Гость Користувач" username="@guest" />
                            </View>

                            <View style={styles.section}>
                                <SectionHeader title="Особиста інформація" isEditing={isEditingPersonal} onEditPress={handlePersonalEditToggle} />
                                <PersonalDataForm control={control} errors={errors} isEditing={isEditingPersonal} />
                            </View>

                            <View style={styles.section}>
                                <SectionHeader title="Пароль" isEditing={isEditingPassword} onEditPress={handlePasswordEditToggle} />
                                <PasswordForm control={control} errors={errors} isEditing={isEditingPassword} />
                            </View>

                            <View style={styles.section}>
                                <SectionHeader title="Варіанти підпису" isEditing={isEditingSignature} onEditPress={handleSignatureEditToggle} />

                                <SignatureVariants
                                    isEditing={isEditingSignature}
                                    isAliasSelected={isAliasSelected}
                                    onAliasToggle={() => setIsAliasSelected(!isAliasSelected)}
                                    isElectronicSelected={isElectronicSelected}
                                    onElectronicToggle={() => setIsElectronicSelected(!isElectronicSelected)}
                                    signatureImageUri={signatureImage}
                                    onSignatureImageChange={setSignatureImage}
                                    authorAlias="Гость Користувач"
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
    tabsContainer: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLOURS.Plum50, paddingHorizontal: 16, paddingVertical: 20 },
    tab: { marginRight: 24, paddingVertical: 5, position: "relative" },
    tabText: { fontSize: 14, color: "#9E9E9E" },
    tabTextActive: { color: COLOURS.darkBlue, fontWeight: "600" },
    indicator: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2, backgroundColor: COLOURS.darkBlue, borderRadius: 1 },
    content: { flex: 1, padding: 16 },
    scrollContent: { paddingBottom: 160 },
    section: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 16 },
});