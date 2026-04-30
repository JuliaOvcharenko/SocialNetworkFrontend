import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './post-content.styles';

interface PostContentProps {
    title?: string;
    text: string;
    tags: string[];
}

export function PostContent({ title, text, tags }: PostContentProps) {
    return (
        <View style={styles.container}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            
            <Text style={styles.text}>{text}</Text>
            
            {tags && tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    <Text style={styles.tagText}>
                        {tags.join(' ')}
                    </Text>
                </View>
            )}
        </View>
    );
}