import React, { useState } from 'react';
import { View } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal'; 
import { Header } from '@shared/ui/header';

export default function MainScreen() {
    // щоб модалка одразу відкрилася при вході на екран
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(true);

    // Функція, яка спрацює після успішної валідації і натискання "Продовжити"
    const handleFirstLoginSubmit = (data: any) => {
        console.log('Дані збережено:', data);
        setFirstLoginModalVisible(false); 
    };

    return (
        <View style={{ flex: 1 }}>
            <Header showSettingsButton showCreateButton showLogoutButton />
            
            <FirstLoginModal 
                isVisible={isFirstLoginModalVisible}
                onClose={() => setFirstLoginModalVisible(false)} 
                onSubmitSuccess={handleFirstLoginSubmit} 
            />
        </View>
    );
}