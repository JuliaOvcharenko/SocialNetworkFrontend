import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RegisterForm } from '@modules/auth/ui/register-form';
import { styles } from '../../../modules/auth/ui/_auth.styles';
import { KeyboardSafeScreen } from "@shared/ui/keyboard-safe-screen";

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <KeyboardSafeScreen style={{ flex: 1 }}>
            <View style={[styles.container, { flex: 1, justifyContent: 'center' }]}>
                <View style={styles.card}>
                    <View style={styles.tabContainer}>
                        <View style={[styles.tab, styles.activeTab]}>
                            <Text style={[styles.tabText, styles.activeTabText]}>Реєстрація</Text>
                        </View>

                        <TouchableOpacity onPress={() => router.push('/login')} style={styles.tab}>
                            <Text style={styles.tabText}>Авторизація</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Приєднуйся до World IT</Text>

                    <RegisterForm />
                </View>
            </View>
        </KeyboardSafeScreen>
    );
}