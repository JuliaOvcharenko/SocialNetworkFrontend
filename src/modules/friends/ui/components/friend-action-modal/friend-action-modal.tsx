import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Button } from '@shared/ui/button';
import { styles } from './friend-action-modal.styles';

interface FriendActionModalProps {
    isVisible: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function FriendActionModal({ 
    isVisible, 
    title = 'Підтвердити дію', 
    description = 'Ви дійсно хочете видалити користувача?', 
    onConfirm, 
    onCancel 
}: FriendActionModalProps) {
    
    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <View style={styles.buttonsRow}>
                        <Button 
                            variant="outline" 
                            title="Скасувати" 
                            onPress={onCancel}
                            style={styles.outlineOverride}
                            textStyle={styles.textOverride}
                        />
                        <Button 
                            variant="primary" 
                            title="Підтвердити" 
                            onPress={onConfirm} 
                            style={styles.primaryOverride}
                            textStyle={styles.textOverride}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}