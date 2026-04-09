import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images";
import { Button } from "@shared/ui/button";

interface SectionHeaderProps {
    title: string;
    isEditing?: boolean;
    onEditPress: () => void;
}

export function SectionHeader({ title, isEditing, onEditPress }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {isEditing ? (
                <Button
                    variant="secondary"
                    title="Зберегти"
                    icon={<IMAGES.PenButton style={{ width: 20, height: 20 }} />}
                    onPress={onEditPress}
                />
            ) : (
                <Button
                    variant="iconCircular"
                    icon={<IMAGES.PenButton style={{ width: 20, height: 20 }} />}
                    onPress={onEditPress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 500,
        color: COLOURS.darkBlue,
    },
});