import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { useSettings } from "@modules/settings/hooks/useSettings";
import { SectionHeader } from "../section-header";
import { ProfileCard } from "../profile-card";
import { PersonalDataForm } from "../personal-data-form";
import { PasswordForm } from "../password-form";
import { SignatureVariants } from "../signature-variants";

export function PersonalDataTab() {
    const {
        user, control, errors, watch, avatarUri,
        isEditingProfile, isEditingPersonal, isEditingPassword, isEditingSignature,
        isAliasSelected, setIsAliasSelected, isElectronicSelected, setIsElectronicSelected,
        signatureImage, setSignatureImage, pickAvatarImage,
        handleProfileEditToggle, handlePersonalEditToggle, handlePasswordEditToggle, handleSignatureEditToggle
    } = useSettings();

    const currentAuthorFullName = watch("authorAlias");

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={[styles.section, isEditingProfile && styles.sectionEditing]}>
                    <SectionHeader title="Картка профілю" isEditing={isEditingProfile} onEditPress={handleProfileEditToggle} />
                    <ProfileCard
                        avatar={user?.profile?.avatar || null}
                        onAddPhoto={() => pickAvatarImage(false)}
                        onReplacePhoto={() => pickAvatarImage(true)}
                        control={control}
                        isEditing={isEditingProfile}
                        authorFullName={user?.profile?.pseudonym || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || ""}
                        usernameView={user?.username ? `@${user.username}` : ""}
                    />
                </View>

                <View style={[styles.section, { paddingBottom: 0 }, isEditingPersonal && styles.sectionEditing]}>
                    <SectionHeader title="Особиста інформація" isEditing={isEditingPersonal} onEditPress={handlePersonalEditToggle} />
                    <PersonalDataForm control={control} errors={errors} isEditing={isEditingPersonal} />

                    <View style={[styles.innerPasswordBox, isEditingPassword && styles.innerPasswordBoxEditing]}>
                        <SectionHeader title="Пароль" isEditing={isEditingPassword} onEditPress={handlePasswordEditToggle} />
                        <PasswordForm control={control} errors={errors} isEditing={isEditingPassword} />
                    </View>
                </View>

                <View style={[styles.section, { paddingBottom: 0 }, isEditingSignature && styles.sectionEditing]}>
                    <SectionHeader title="Варіанти підпису" isEditing={isEditingSignature} onEditPress={handleSignatureEditToggle} />
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
    );
}

const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 40, paddingTop: 16, paddingHorizontal: 16 }, 
    section: { backgroundColor: COLOURS.white, borderRadius: 24, padding: 20, marginBottom: 8, borderWidth: 1, borderColor: COLOURS.Gray },
    sectionEditing: { borderColor: COLOURS.Plum },
    innerPasswordBox: { borderRadius: 20, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, marginHorizontal: -16, backgroundColor: COLOURS.white },
    innerPasswordBoxEditing: { borderWidth: 1, borderColor: COLOURS.Plum },
});