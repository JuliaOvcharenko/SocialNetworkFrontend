import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "@shared/ui/button";
import { styles } from "./friend-card.styles";
import { useRouter } from "expo-router";
import { IProfile, IUser } from "@modules/friends/api/friend.types";
import { BASE_URL } from "@shared/config/api.config";
import { COLOURS } from "@shared/constants/colours"; 

function photoUri(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const filename = url.split("/").pop();
    return `${BASE_URL}/media/shakal/${filename}`;
}

interface FriendCardProps {
    user: IUser;
    variant: "request" | "recommendation" | "friend";
    onPrimaryPress: () => void;
    onSecondaryPress: () => void;
}

export function FriendCard({
    user,
    variant,
    onPrimaryPress,
    onSecondaryPress,
}: FriendCardProps) {
    const router = useRouter();

    const getPrimaryText = () => {
        if (variant === "request") return "Підтвердити";
        if (variant === "recommendation") return "Додати";
        return "Повідомлення";
    };

    const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.profile?.pseudonym ||
        user.username ||
        user.email?.split("@")[0].slice(0, 10) ||
        "Без імені";

    const alias = user.username
        ? `@${user.username}`
        : (user.profile?.pseudonym ??
            user.email?.split("@")[0].slice(0, 8) ??
            `Профіль ${user.id}`);

    const avatarUrl = user.profile?.avatar;

    const isValidAvatar = (url: string | null | undefined): boolean => {
        if (!url) return false;
        if (url === "defaultAvatar.png") return false;
        return true;
    };

    const handleCardPress = () => {
        router.push(`/core/userscreen/${user.id}`);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handleCardPress}
            activeOpacity={0.8}
        >
            <View style={styles.avatarContainer}>
                <Image
                    source={
                        isValidAvatar(avatarUrl)
                            ? { uri: photoUri(avatarUrl!) }
                            : require("@assetsIcons/default-avatar.png")
                    }
                    style={styles.avatar}
                />
                <View 
                    style={[
                        styles.indicator, 
                        { backgroundColor: user.isOnline ? COLOURS.Green100 : COLOURS.Blue20 }
                    ]} 
                />
            </View>

            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.alias}>{alias}</Text>

            <View style={styles.buttonsRow}>
                <View style={styles.btnContainer}>
                    <Button
                        variant="primary"
                        title={getPrimaryText()}
                        onPress={(e) => {
                            e.stopPropagation?.();
                            if (variant === "friend") {
                                router.push(`/core/userscreen/${user.id}`);
                            } else if (
                                variant === "request" ||
                                variant === "recommendation"
                            ) {
                                handleCardPress();
                            } else {
                                onPrimaryPress();
                            }
                        }}
                        style={styles.fullWidthBtn}
                        textStyle={styles.btnText}
                    />
                </View>
                <View style={styles.btnContainer}>
                    <Button
                        variant="outline"
                        title="Видалити"
                        onPress={(e) => {
                            e.stopPropagation?.();
                            onSecondaryPress();
                        }}
                        style={styles.fullWidthBtn}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}