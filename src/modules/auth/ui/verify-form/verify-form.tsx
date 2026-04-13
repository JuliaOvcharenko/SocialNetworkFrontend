import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button } from '@shared/ui/button/button';
import { NumberButton } from '@shared/ui/numberButton';
import { styles } from './verify-form.styles';
import { useVerifyMutation } from '@modules/auth/api/auth-api';
import { verifyValidator } from '@modules/lib/login/verify.schema';

export function VerifyForm({ onBack }: { onBack?: () => void }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [verify, { isLoading }] = useVerifyMutation();

    const onSubmit = async () => {
        try {
            await verifyValidator.validate({ code });
            setError('');
        } catch (validationError: any) {
            setError(validationError.message);
            return;
        }

        try {
            await verify({ code: Number(code) }).unwrap();
            Alert.alert('Успіх', 'Код успішно підтверджено!');
        } catch (err: any) {
            Alert.alert('Помилка', err.data?.message || 'Невірний код');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.wrapper}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Підтвердження пошти</Text>

                <Text style={styles.description}>
                    Ми надіслали 6-значний код на вашу пошту. Введіть
                    його нижче, щоб підтвердити акаунт
                </Text>

                <Text style={styles.label}>Код підтвердження</Text>
                <NumberButton onComplete={(val) => { setCode(val); setError(''); }} />
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Button
                    title={isLoading ? 'Перевірка...' : 'Підтвердити'}
                    onPress={onSubmit}
                    style={styles.submitButton}
                    disabled={isLoading}
                />

                <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
                    <Text style={styles.backText}>Назад</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}