import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { Header } from "@shared/ui/header/header";
import { CreatePostModal } from '@modules/post/ui/create-post-modal';
import { Post } from '@modules/post/ui/post';
import { useGetMyPostsQuery } from '@modules/post/api/post.api';

export default function PublicationsScreen() {
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

    const { data: postsData, isLoading, isError } = useGetMyPostsQuery({ page: 1, limit: 5 });
    const posts = postsData?.data ?? [];

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

            <CreatePostModal
                isVisible={isCreateModalVisible}
                onClose={() => setCreateModalVisible(false)}
            />
        </View>
    );
}