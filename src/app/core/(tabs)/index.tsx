import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal';
import { Header } from '@shared/ui/header';
import { FirstLoginFormData } from '@modules/lib/login/first-login-modal.schema';

import { useUpdateProfileMutation, useGetMeQuery } from "@modules/auth/api/user-api";
import { CreatePostModal } from '@modules/post/ui/create-post-modal';
import { Post } from '@modules/post/ui/post';

const MOCK_POSTS = [
    {
        id: '1',
        author: {
            id: 'user_1',
            nickname: 'kaka',
            avatarUrl: require('../../../assets/Frame1.png'),
            isOnline: true,
            signatureUrl: require('../../../assets/icons/sign.png')
        },
        title: 'Природа, книга і спокій 🌿',
        text: 'Інколи найкращі ідеї народжуються в тиші 🌿\nПрирода, книга і спокій — усе, що потрібно, аби перезавантажитись.',
        tags: ['#відпочинок', '#натхнення', '#життя', '#природа', '#читання', '#спокій', '#гармонія'],
        images: [
            require('../../../assets/Frame1.png'),
            require('../../../assets/Frame2.png'),
            require('../../../assets/Frame1.png'),
            require('../../../assets/Frame2.png'),
            require('../../../assets/Frame1.png'),
        ],
        likesCount: 120,
        viewsCount: 890,
        isLikedByMe: false,
        createdAt: new Date().toISOString(),
    }
];

export default function MainScreen() {
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

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
            setFirstLoginModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <Header
                showSettingsButton
                showCreateButton
                showLogoutButton
                onCreatePress={() => setCreateModalVisible(true)}
            />

            <FlatList
                data={MOCK_POSTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Post post={item as any} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            />

            <FirstLoginModal
                isVisible={isFirstLoginModalVisible}
                onSubmitSuccess={handleFirstLoginSubmit}
            />

            <CreatePostModal
                isVisible={isCreateModalVisible}
                onClose={() => setCreateModalVisible(false)}
            />
        </View>
    );
}