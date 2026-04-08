import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLOURS } from "@shared/constants/colours";

interface ProfileCardProps {
    avatarUri: string | null;
    fullName: string;
    username: string;
}

export function ProfileCard({ avatarUri, fullName, username }: ProfileCardProps) {
    return (
        <View style={styles.profileCard}>
            {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarPlaceholder} />
            ) : (
                <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileUsername}>{username}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E0E0',
        marginBottom: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOURS.darkBlue,
    },
    profileUsername: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
});