import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '@shared/ui/button';
import { styles } from './friend-card.styles';

interface FriendCardProps {
    user: {
        avatarUrl: any;
        name: string;
        alias: string;
        isOnline?: boolean;
    };
    variant: 'request' | 'recommendation' | 'friend';
    onPrimaryPress: () => void;
    onSecondaryPress: () => void;
}

export function FriendCard({ user, variant, onPrimaryPress, onSecondaryPress }: FriendCardProps) {
    const getPrimaryText = () => {
        if (variant === 'request') return 'Підтвердити';
        if (variant === 'recommendation') return 'Додати';
        return 'Повідомлення';
    };

    return (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <Image source={user.avatarUrl} style={styles.avatar} />
                <View style={[styles.indicator, user.isOnline && styles.online]} />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.alias}>{user.alias}</Text>

            <View style={styles.buttonsRow}>
                <View style={styles.btnContainer}>
                    <Button 
                        variant="primary" 
                        title={getPrimaryText()} 
                        onPress={onPrimaryPress}
                        style={styles.fullWidthBtn}
                        textStyle={styles.btnText}
                    />
                </View>
                <View style={styles.btnContainer}>
                    <Button 
                        variant="outline" 
                        title="Видалити" 
                        onPress={onSecondaryPress}
                        style={ styles.fullWidthBtn}
                    />
                </View>
            </View>
        </View>
    );
}