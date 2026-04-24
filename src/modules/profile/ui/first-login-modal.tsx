import React from 'react';
import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styles } from './first-login-modal.styles';
import { FirstLoginFormData, firstLoginSchema } from '@modules/lib/login/first-login-modal.schema';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';

interface FirstLoginModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmitSuccess: (data: FirstLoginFormData) => void;
}

export function FirstLoginModal({ isVisible, onClose, onSubmitSuccess }: FirstLoginModalProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<FirstLoginFormData>({
        resolver: yupResolver(firstLoginSchema),
        defaultValues: {
            authorAlias: '',
            nickname: '@',
        }
    });

    const onSubmit = (data: FirstLoginFormData) => {
        onSubmitSuccess(data);
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardWrapper}
                >
                    <View style={styles.card}>
                        
                        <View style={styles.header}>
                            <Text style={styles.title}>Додай деталі про себе</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Controller
                            control={control}
                            name="authorAlias"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Псевдонім автора"
                                    placeholder="Введіть Псевдонім автора"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.authorAlias?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="nickname"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Ім'я користувача"
                                    placeholder="@"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.nickname?.message}
                                />
                            )}
                        />

                        <Text style={styles.hintText}>
                            Або оберіть: <Text style={styles.hintTextGreen}>(Запропоновані варіанти відповідно до Ім'я та Прізвища)</Text>
                        </Text>

                        <Button 
                            title="Продовжити" 
                            onPress={handleSubmit(onSubmit)} 
                            style={styles.submitButton} 
                            textStyle={{ fontSize: 14 }}
                        />

                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}