import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal'; 
import { Header } from '@shared/ui/header';
import { FirstLoginFormData } from '@modules/lib/login/first-login-modal.schema';

import { useUpdateProfileMutation, useGetMeQuery } from "@modules/auth/api/user-api";

export default function MainScreen() {
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(false);
    const { data: user } = useGetMeQuery(); 
    const [updateProfile] = useUpdateProfileMutation(); 

    useEffect(() => {
        if (user && !user.nickname) {
            setFirstLoginModalVisible(true);
        }
    }, [user]);

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
                onSubmitSuccess={handleFirstLoginSubmit} 
            />
        </View>
    );
}
