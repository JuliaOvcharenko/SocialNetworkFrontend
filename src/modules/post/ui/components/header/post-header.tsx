import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './post-header.styles';
import { IUser } from '../../../types/post.types';
import { IMAGES } from '@shared/ui/images';

interface PostHeaderProps {
    author: IUser;
}

export function PostHeader({ author }: PostHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <Image source={author.avatarUrl as any} style={styles.avatar} />
                        {author.isOnline && <View style={styles.onlineIndicator} />}
                    </View>

                    <Text style={styles.nickname}>{author.nickname}</Text>
                </View>

                <TouchableOpacity style={styles.moreButton}>
                    <IMAGES.MoreButton />
                </TouchableOpacity>
            </View>

            {author.signatureUrl && (
                <Image source={author.signatureUrl as any} style={styles.signature} />
            )}

            <View style={styles.separator} />
        </View>
    );
}