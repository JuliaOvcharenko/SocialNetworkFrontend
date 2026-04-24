import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Control, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input";
import { SettingsFormData } from "../../lib/settings/settings.schema";
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images";
import { BASE_URL } from '@shared/config/api.config';


interface ProfileCardProps {
    avatars: any[] | null;
    onAddPhoto: () => void;
    onReplacePhoto: () => void;
    onIndexChange: (index: number) => void;
    control: Control<SettingsFormData>;
    isEditing: boolean;
    authorFullName: string;
    usernameView: string;
}

const AVATAR_SIZE = 120;

export function ProfileCard({
    avatars,
    onAddPhoto,
    onReplacePhoto,
    onIndexChange,
    control,
    isEditing,
    authorFullName,
    usernameView
}: ProfileCardProps) {

    const [activeIndex, setActiveIndex] = useState(0);

    const renderAvatarItem = ({ item }: { item: any }) => {
        const uri = item.image?.shakalImageURL
            ? `${BASE_URL}${item.image.shakalImageURL}`
            : null;

        return (
            <View style={styles.avatarWrapper}>
                {uri ? (
                    <Image source={{ uri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder} />
                )}
            </View>
        );
    };

    return (
        <View style={isEditing ? styles.containerEdit : styles.container}>
            {isEditing && (
                <Text style={styles.promptText}>Оберіть або завантажте фото профілю</Text>
            )}

            <View style={styles.carouselContainer}>
                {avatars && avatars.length > 0 ? (
                    <FlatList
                        data={avatars}
                        renderItem={renderAvatarItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / AVATAR_SIZE);

                            setActiveIndex(index);

                            onIndexChange(index);
                        }}
                        contentContainerStyle={{ alignItems: 'center' }}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder} />
                )}

                {avatars && avatars.length > 1 && (
                    <View style={styles.pagination}>
                        {avatars.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i === activeIndex && styles.activeDot]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {isEditing ? (
                <>
                    <View style={styles.photoActionsRow}>
                        <TouchableOpacity style={styles.photoActionButton} onPress={onAddPhoto}>
                            <IMAGES.PlusButton style={styles.icon} />
                            <Text style={styles.photoActionText}>Додайте фото</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.photoActionButton} onPress={onReplacePhoto}>
                            <IMAGES.GalleryButton style={styles.icon} />
                            <Text style={styles.photoActionText}>Оберіть фото</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.nameText}>{authorFullName}</Text>

                    <View style={styles.formWrapper}>
                        <Controller
                            control={control}
                            name="nickname"
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
                </>
            ) : (
                <>
                    <Text style={styles.nameText}>{authorFullName}</Text>
                    <Text style={styles.usernameText}>{usernameView}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center' },
    containerEdit: { alignItems: 'center', width: '100%' },

    carouselContainer: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrapper: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },
    avatarPlaceholder: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: COLOURS.Plum50
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLOURS.Plum50,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: COLOURS.Plum,
        width: 12,
    },

    nameText: { fontSize: 24, fontWeight: '700', color: COLOURS.darkBlue, marginBottom: 4 },
    usernameText: { fontSize: 16, fontWeight: '500', color: COLOURS.darkBlue },

    promptText: { fontSize: 16, fontWeight: '400', color: COLOURS.darkBlue, marginBottom: 20, textAlign: 'center' },
    photoActionsRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 24 },
    photoActionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    icon: { width: 20, height: 20 },
    photoActionText: { fontSize: 16, fontWeight: '500', color: COLOURS.Plum },
    formWrapper: { width: '100%', marginTop: 10 },
});