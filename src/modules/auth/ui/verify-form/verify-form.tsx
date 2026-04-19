import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button } from '@shared/ui/button/button';
import { NumberButton } from '@shared/ui/numberButton';
import { styles } from './verify-form.styles';
import { useVerifyMutation } from '@modules/auth/api/auth-api';
import { verifyValidator } from '@modules/lib/login/verify.schema';
import { useRouter } from 'expo-router'; // Импортируем роутер

export function VerifyForm({ onBack }: { onBack?: () => void }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // Флаг успешной отправки
    const [verify, { isLoading }] = useVerifyMutation();
    const router = useRouter(); // Инициализируем роутер

    const onSubmit = async () => {
        if (isSuccess) return; 

        try {
            await verifyValidator.validate({ code });
            setError('');
        } catch (validationError: any) {
            setError(validationError.message);
            return;
        }

        try {
            await verify({ code }).unwrap();
            setIsSuccess(true); // Ставим флаг успеха, чтобы заблокировать форму
        } catch (err: any) {
            // Выводим ошибку с бэкенда красным текстом прямо под инпутом
            setError(err.data?.message || 'Невірний код. Спробуйте ще раз.');
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
                
                {/* Теперь ошибка будет красиво светиться здесь */}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Button
                    // Меняем текст кнопки, если всё прошло успешно
                    title={isLoading ? 'Перевірка...' : isSuccess ? 'Підтверджено' : 'Підтвердити'}
                    onPress={onSubmit}
                    style={styles.submitButton}
                    // Блокируем кнопку во время загрузки ИЛИ если уже успешно
                    disabled={isLoading || isSuccess} 
                />

                <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
                    <Text style={styles.backText}>Назад</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}