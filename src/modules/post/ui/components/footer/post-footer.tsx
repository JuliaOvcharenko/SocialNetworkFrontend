import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IMAGES } from '@shared/ui/images';
import { styles } from './post-footer.styles';

interface PostFooterProps {
    likes: number;
    views: number;
    isLiked: boolean;
}

export function PostFooter({ likes, views, isLiked }: PostFooterProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.actionItem}>
                    <IMAGES.HeartButton />
                    <Text style={styles.actionText}>{likes} Вподобань</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                    <IMAGES.LikeButton />
                    <Text style={styles.actionText}>{likes} Вподобань</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.row}>
                <View style={styles.actionItem}>
                    <IMAGES.EyePButton />
                    <Text style={styles.actionText}>{views} Переглядів</Text>
                </View>
            </View>
        </View>
    );
}