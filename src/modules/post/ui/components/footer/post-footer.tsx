import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images";
import { styles } from "./post-footer.styles";
import {
	useToggleLikeMutation,
	useToggleHeartMutation,
} from "@modules/post/api/post.api";

interface PostFooterProps {
	postId: number;
	likes: number;
	hearts: number;
	views: number;
	isLiked: boolean;
	isHearted: boolean;
}

export function PostFooter({
	postId,
	likes,
	hearts,
	views,
	isLiked,
	isHearted,
}: PostFooterProps) {
	const [toggleLike] = useToggleLikeMutation();
	const [toggleHeart] = useToggleHeartMutation();

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<TouchableOpacity
					style={styles.actionItem}
					onPress={() => toggleHeart(postId)}
				>
					<IMAGES.HeartButton
						style={[
							styles.icon,
							isHearted && { tintColor: COLOURS.Plum },
						]}
					/>
					<Text
						style={
							isHearted
								? styles.actionTextActive
								: styles.actionText
						}
					>
						{hearts} Вподобань
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionItem}
					onPress={() => toggleLike(postId)}
				>
					<IMAGES.LikeButton
						style={[
							styles.icon,
							isLiked && { tintColor: COLOURS.Plum },
						]}
					/>
					<Text
						style={
							isLiked
								? styles.actionTextActive
								: styles.actionText
						}
					>
						{likes} Вподобань
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.row}>
				<View style={styles.actionItem}>
					<IMAGES.EyePButton />
					<Text style={styles.actionText}>{views} Переглядів</Text>
				</View>
			</View>
		</View>
	);
}
