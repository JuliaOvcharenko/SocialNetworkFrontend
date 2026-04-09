import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Control, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input";
import { SettingsFormData } from "../../lib/settings/settings.schema";
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images";

interface ProfileCardProps {
    avatarUri: string | null;
    onAvatarPress: () => void;
    control: Control<SettingsFormData>;
    isEditing: boolean;

    authorFullName: string;
    usernameView: string;
}

export function ProfileCard({ avatarUri, onAvatarPress, control, isEditing, authorFullName, usernameView }: ProfileCardProps) {

    if (!isEditing) {
        return (
            <View style={styles.container}>
                <View style={styles.avatarWrapper}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder} />
                    )}
                </View>
                <Text style={styles.nameText}>{authorFullName}</Text>
                <Text style={styles.usernameText}>{usernameView}</Text>
            </View>
        );
    }

    return (
        <View style={styles.containerEdit}>
            <Text style={styles.promptText}>Оберіть або завантажте фото профілю</Text>

            <View style={styles.avatarWrapper}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder} />
                )}
            </View>

            <View style={styles.photoActionsRow}>
                <TouchableOpacity style={styles.photoActionButton} onPress={onAvatarPress}>
                    <IMAGES.PlusButton style={styles.icon} />
                    <Text style={styles.photoActionText}>Додайте фото</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoActionButton} onPress={onAvatarPress}>
                    <IMAGES.GalleryButton style={styles.icon} />
                    <Text style={styles.photoActionText}>Оберіть фото</Text>
                </TouchableOpacity>
            </View>


            <Text style={styles.nameText}>{authorFullName}</Text>

            {/* Форма для юзернейма */}
            <View style={styles.formWrapper}>
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                            editable={true}
                            label="Ім'я користувача"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="@thelili"
                            error={error?.message}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: { alignItems: 'center' },
    containerEdit: { alignItems: 'center', width: '100%' },
    avatarWrapper: { marginBottom: 24 },
    avatar: { width: 96, height: 96, borderRadius: 50 },
    avatarPlaceholder: { width: 96, height: 96, borderRadius: 50, backgroundColor: COLOURS.Plum50 },

    nameText: { fontSize: 24, fontWeight: '700', color: COLOURS.darkBlue, marginBottom: 10 },
    usernameText: { fontSize: 16, fontWeight: '500', color: COLOURS.darkBlue },

    promptText: { fontSize: 16, fontWeight: 400, color: COLOURS.darkBlue, marginBottom: 20, textAlign: 'center' },
    photoActionsRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 24 },
    photoActionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },

    icon: { width: 20, height: 20 },

    photoActionText: { fontSize: 16, fontWeight: 500, color: COLOURS.Plum },
    formWrapper: { width: '100%', marginTop: 10 },
});