import React, { useState } from 'react';
import { View } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal'; 
import { Header } from '@shared/ui/header';
import { FirstLoginFormData } from '@modules/lib/login/first-login-modal.schema';


import { useUpdateProfileMutation } from "@modules/auth/api/user-api";

export default function MainScreen() {
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(true);
    
    const [updateProfile] = useUpdateProfileMutation(); 

    const handleFirstLoginSubmit = async (data: FirstLoginFormData) => {
        try {
            const cleanNickname = data.nickname.replace('@', '');

            await updateProfile({
                authorAlias: data.authorAlias,
                nickname: cleanNickname
            }).unwrap();

            console.log('Дані успішно збережено в БД');
            setFirstLoginModalVisible(false); 
        } catch (error) {
            console.error('Помилка при збереженні:', error);
        }
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