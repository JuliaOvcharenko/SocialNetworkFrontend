import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';

import { FirstLoginModal } from '../../../modules/profile/ui/first-login-modal';
import { Header } from '@shared/ui/header';
import { FirstLoginFormData } from '@modules/lib/login/first-login-modal.schema';

import { useUpdateProfileMutation, useGetMeQuery } from "@modules/auth/api/user-api";
import { CreatePostModal } from '@modules/post/ui/create-post-modal';
import { Post } from '@modules/post/ui/post';
import { useGetAllPostsQuery } from '@modules/post/api/post.api';


export default function MainScreen() {
    const [isFirstLoginModalVisible, setFirstLoginModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

    const { data: user } = useGetMeQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const { data: postsData, isLoading, isError } = useGetAllPostsQuery({ page: 1, limit: 5 });
    const posts = postsData?.data ?? [];

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
            throw error
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

            {isLoading && <ActivityIndicator style={{ marginTop: 32 }} size="large" />}
            {isError && (
                <Text style={{ textAlign: 'center', marginTop: 32, color: 'red' }}>
                    Не вдалось завантажити пости
                </Text>
            )}

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Post post={item} />}
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

