import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./post-header.styles";
import { IPost, IUser } from "../../../types/post.types";
import { IMAGES } from "@shared/ui/images";
import { BASE_URL } from "@shared/config/api.config";
import { PostOptionsModal } from "./postOptional/PostOptionsModal";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import { CreatePostModal } from "../../create-post-modal";

interface PostHeaderProps {
	author: IUser;
	postId: number;
	initialData: IPost;
}

export function PostHeader({ author, postId, initialData }: PostHeaderProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

	useEffect(() => {
		getCurrentUserId().then((id) => {
			setIsOwner(id === author.id);
		});
	}, [author.id]);

	const avatarUri = author.avatarUrl ? `${BASE_URL}${author.avatarUrl}` : null;
	const signatureUri = author.signatureUrl ? `${BASE_URL}${author.signatureUrl}` : null;

	const handleEdit = () => {
		setMenuVisible(false);
		setEditModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<View style={styles.topRow}>
				<View style={styles.userInfo}>
					<View style={styles.avatarContainer}>
						{avatarUri ? (
							<Image source={{ uri: avatarUri }} style={styles.avatar} />
						) : (
							<View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
						)}
						{author.isOnline && <View style={styles.onlineIndicator} />}
					</View>
					<Text style={styles.nickname}>{author.nickname}</Text>
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
				<Image source={{ uri: signatureUri }} style={styles.signature} />
			) : null}

			<View style={styles.separator} />

			<PostOptionsModal
				visible={menuVisible}
				postId={postId}
				onClose={() => setMenuVisible(false)}
				onEdit={handleEdit}
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