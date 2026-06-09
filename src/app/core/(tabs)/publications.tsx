import React, { useState } from "react";
import { View } from "react-native";
import { Header } from "@shared/ui/header/header";
import { CreatePostModal } from "@modules/post/ui/create-post-modal";
import { useGetMyPostsQuery } from "@modules/post/api/post.api";
import { PostFeed } from "@shared/ui/postFeed/postFeed";

export default function PublicationsScreen() {
	const [isCreateModalVisible, setCreateModalVisible] = useState(false);
	const { data, isLoading, isError } = useGetMyPostsQuery({
		page: 1,
		limit: 5,
	});

	return (
		<View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
			<Header
				showSettingsButton
				showCreateButton
				showLogoutButton
				onCreatePress={() => setCreateModalVisible(true)}
			/>

			<PostFeed
				posts={data?.data ?? []}
				isLoading={isLoading}
				isError={isError}
			/>

			<CreatePostModal
				isVisible={isCreateModalVisible}
				onClose={() => setCreateModalVisible(false)}
			/>
		</View>
	);
}
