import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./post-header.styles";
import { IPost, IUser } from "../../../types/post.types";
import { IMAGES } from "@shared/ui/images";
import { BASE_URL } from "@shared/config/api.config";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import { CreatePostModal } from "../../create-post-modal";
import { Ionicons } from "@expo/vector-icons";
import { useDeletePostMutation } from "@modules/post/api/post.api";
import { ActionModal } from "@shared/ui/modals/mini-edit-modal";

interface PostHeaderProps {
	author: IUser;
	postId: number;
	initialData: IPost;
}

export function PostHeader({ author, postId, initialData }: PostHeaderProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

	const [deletePost] = useDeletePostMutation();

	useEffect(() => {
		getCurrentUserId().then((id) => {
			setIsOwner(id === Number(author.id));
		});
	}, [author.id]);

	const avatarUri = author.avatarUrl
		? `${BASE_URL}${author.avatarUrl}`
		: null;
	const signatureUri = author.signatureUrl
		? `${BASE_URL}${author.signatureUrl}`
		: null;

	const handleEdit = () => {
		setEditModalVisible(true);
	};

	const handleDelete = async () => {
		await deletePost(postId);
	};

	const postActions = [
		{
			id: "edit",
			title: "Редактировать",
			icon: <Ionicons name="create-outline" size={22} color="#1B1A2A" />,
			onPress: handleEdit,
		},
		{
			id: "delete",
			title: "Удалить",
			icon: <Ionicons name="trash-outline" size={22} color="#1B1A2A" />,
			danger: true,
			onPress: handleDelete,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.topRow}>
				<View style={styles.userInfo}>
					<View style={styles.avatarContainer}>
						{avatarUri ? (
							<Image
								source={{ uri: avatarUri }}
								style={styles.avatar}
							/>
						) : (
							<View
								style={[
									styles.avatar,
									{ backgroundColor: "#ccc" },
								]}
							/>
						)}
						{author.isOnline && (
							<View style={styles.onlineIndicator} />
						)}
					</View>
					<Text style={styles.nickname}>{author.username}</Text>
				</View>

				{isOwner && (
					<TouchableOpacity
						style={styles.moreButton}
						onPress={() => setMenuVisible(true)}
					>
						<IMAGES.MoreButton />
					</TouchableOpacity>
				)}
			</View>

			{signatureUri ? (
				<Image
					source={{ uri: signatureUri }}
					style={styles.signature}
				/>
			) : null}

			<View style={styles.separator} />

			<ActionModal
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
				actions={postActions}
			/>

			<CreatePostModal
				isVisible={editModalVisible}
				onClose={() => setEditModalVisible(false)}
				editPostId={postId}
				initialData={initialData}
			/>
		</View>
	);
}
