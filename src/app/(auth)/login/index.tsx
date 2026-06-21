import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../modules/auth/ui/_auth.styles';
import { LoginForm } from '@modules/auth/ui/login-form';
import { KeyboardSafeScreen } from "@shared/ui/keyboard-safe-screen"; 
export default function LoginScreen() {
    const router = useRouter();

    return (
        <KeyboardSafeScreen style={{ flex: 1 }}>
            <View style={[styles.container, { flex: 1, justifyContent: 'center' }]}>
                <View style={styles.card}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={() => router.push('/register')} style={styles.tab}>
                            <Text style={styles.tabText}>Реєстрація</Text>
                        </TouchableOpacity>
                        <View style={[styles.tab, styles.activeTab]}>
                            <Text style={[styles.tabText, styles.activeTabText]}>Авторизація</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Раді тебе знову бачити!</Text>

                    <LoginForm />
                </View>
            </View>
        </KeyboardSafeScreen>
    );
}