import React from "react";
import { View } from "react-native";
import { IPost } from "../types/post.types";
import { styles } from "./post.styles";
import { PostHeader } from "./components/header/post-header";
import { PostFooter } from "./components/footer/post-footer";
import { PostContent } from "./components/content/post-content";
import { PostGallery } from "./components/gallery/post-gallery";

interface PostProps {
	post: IPost;
}

export function Post({ post }: PostProps) {
	return (
		<View style={styles.postContainer}>
			<PostHeader
				author={post.author}
				postId={post.id}
				initialData={post}
			/>

			<PostContent
				title={post.title}
				topic={post.topic}
				content={post.content}
				tags={post.tags}
				links={post.links}
			/>

			<PostGallery images={post.images} />

			<PostFooter
				postId={post.id}
				likes={post.likesCount}
				hearts={post.heartsCount}
				views={post.viewsCount}
				isLiked={post.isLiked}
				isHearted={post.isHearted}
			/>
		</View>
	);
}
