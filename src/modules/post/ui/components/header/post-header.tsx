import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./post-header.styles";
import { IUser } from "../../../types/post.types";
import { IMAGES } from "@shared/ui/images";
import { BASE_URL } from "@shared/config/api.config";

interface PostHeaderProps {
    author: IUser;
}

export function PostHeader({ author }: PostHeaderProps) {
    const avatarUri = author.avatarUrl ? `${BASE_URL}${author.avatarUrl}` : null;
    const signatureUri = author.signatureUrl ? `${BASE_URL}${author.signatureUrl}` : null;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
                        )}
                        {author.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <Text style={styles.nickname}>{author.nickname}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <IMAGES.MoreButton />
                </TouchableOpacity>
            </View>

            {signatureUri ? (
                <Image source={{ uri: signatureUri }} style={styles.signature} />
            ) : null}

            <View style={styles.separator} />
        </View>
    );
}