import React from "react";
import { FlatList, ActivityIndicator, Text } from "react-native";
import { Post as PostItem } from "@modules/post/ui/post";
import { IPost } from "@modules/post/types/post.types";

interface PostFeedProps {
    posts: IPost[];
    isLoading: boolean;
    isError: boolean;
}

export const PostFeed: React.FC<PostFeedProps> = ({ posts, isLoading, isError }) => {
    if (isLoading) return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;

    if (isError) return (
        <Text style={{ textAlign: "center", marginTop: 32, color: "red" }}>
            Не вдалось завантажити пости
        </Text>
    );

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostItem post={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        />
    );
};