import React from "react";
import { View, Text, Linking } from "react-native";
import { styles } from "./post-content.styles";

interface PostContentProps {
	title: string;
	topic?: string | null;
	content: string;
	tags: string[];
	links?: { id: number; url: string }[];
}

export function PostContent({
	title,
	topic,
	content,
	tags,
	links,
}: PostContentProps) {
	const bodyText = tags?.length
		? tags.reduce((acc, tag) => {
				const normalized = tag.startsWith("#") ? tag : `#${tag}`;
				return (acc ?? "")
					.replace(normalized, "")
					.replace(/\s+/g, " ")
					.trim();
			}, content ?? "")
		: (content ?? "");

	return (
		<View style={styles.container}>
			{title ? <Text style={styles.title}>{title}</Text> : null}
			{topic ? <Text style={styles.title}>{topic}</Text> : null}
			{bodyText ? <Text style={styles.text}>{bodyText}</Text> : null}

			{tags?.length > 0 && (
				<View style={styles.tagsContainer}>
					{tags.map((tag, index) => (
						<Text key={`tag-${index}`} style={styles.tagText}>
							{tag.startsWith("#") ? tag : `#${tag}`}
						</Text>
					))}
				</View>
			)}

			{(links ?? []).map((link, index) => (
				<Text
					key={link.id ?? `link-${index}`}
					style={styles.linkText}
					onPress={() => Linking.openURL(link.url)}
				>
					{link.url}
				</Text>
			))}
		</View>
	);
}
