import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Header } from "@shared/ui/header";
import { FirstLoginModal } from "@modules/profile/ui/first-login-modal";
import { CreatePostModal } from "@modules/post/ui/create-post-modal";
import { FirstLoginFormData } from "@modules/lib/login/first-login-modal.schema";
import {
	useUpdateProfileMutation,
	useGetMeQuery,
} from "@modules/auth/api/user-api";
import { useGetAllPostsQuery } from "@modules/post/api/post.api";
import { PostFeed } from "@shared/ui/postFeed/postFeed";

export default function MainScreen() {
	const [isFirstLoginModalVisible, setFirstLoginModalVisible] =
		useState(false);
	const [isCreateModalVisible, setCreateModalVisible] = useState(false);

	const { data: user } = useGetMeQuery();
	const [updateProfile] = useUpdateProfileMutation();
	const { data, isLoading, isError } = useGetAllPostsQuery({
		page: 1,
		limit: 5,
	});

	useEffect(() => {
		if (user && !user.username) setFirstLoginModalVisible(true);
	}, [user]);

	const handleFirstLoginSubmit = async (data: FirstLoginFormData) => {
		const cleanNickname = data.nickname.replace("@", "");
		await updateProfile({
			username: cleanNickname,
			profile: { pseudonym: data.authorAlias },
		}).unwrap();
		setFirstLoginModalVisible(false);
	};

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
