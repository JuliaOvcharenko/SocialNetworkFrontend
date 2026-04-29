import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal'; 
import { Header } from '@shared/ui/header';
import { FirstLoginFormData } from '@modules/lib/login/first-login-modal.schema';

import { useUpdateProfileMutation, useGetMeQuery } from "@modules/auth/api/user-api";
import { CreatePostModal } from '@modules/post/ui/create-post-modal';

export default function MainScreen() {
    // Стейт для первой авторизации
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(false);
    
    // Стейт для создания поста (наша новая модалка)
    const [isCreateModalVisible, setCreateModalVisible] = useState(false); // <--- Добавили стейт

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
            {/* Добавили функцию onCreatePress для плюсика */}
            <Header 
                showSettingsButton 
                showCreateButton 
                showLogoutButton 
                onCreatePress={() => setCreateModalVisible(true)} 
            />
            
            {/* ... тут в будущем будет список постов ... */}

            <FirstLoginModal 
                isVisible={isFirstLoginModalVisible}
                onSubmitSuccess={handleFirstLoginSubmit} 
            />

            {/* Вставили новую модалку */}
            <CreatePostModal 
                isVisible={isCreateModalVisible} 
                onClose={() => setCreateModalVisible(false)} 
            />
        </View>
    );
}