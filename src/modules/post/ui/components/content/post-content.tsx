import React from "react";
import { View, Text, Linking } from "react-native";
import { styles } from "./post-content.styles";

interface PostContentProps {
	title?: string;
	text?: string;
	content?: string;
	tags: string[];
	links?: { id: number; url: string }[];
}

export function PostContent({
	title,
	text,
	content,
	tags,
	links,
}: PostContentProps) {
	const bodyText = text || content || "";

	return (
		<View style={styles.container}>
			{title ? <Text style={styles.title}>{title}</Text> : null}
			{bodyText ? <Text style={styles.text}>{bodyText}</Text> : null}

			{tags?.length > 0 && (
				<View style={styles.tagsContainer}>
					{tags.map((tag, index) => (
						<Text key={index} style={styles.tagText}>
							#{tag}
						</Text>
					))}
				</View>
			)}

			{(links ?? []).map((link) => (
				<Text
					key={link.id}
					style={styles.linkText}
					onPress={() => Linking.openURL(link.url)}
				>
					{link.url}
				</Text>
			))}
		</View>
	);
}
