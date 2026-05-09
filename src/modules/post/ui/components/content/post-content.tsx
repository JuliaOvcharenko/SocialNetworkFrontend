import React from "react";
import { View, Text, Image, Linking } from "react-native";
import { styles } from "./post-content.styles";

interface PostContentProps {
	title?: string;
	text?: string;
	content?: string;
	tags: string[];
	links?: { id: number; url: string }[];
	images?: { id: number; uri: string }[];
}

export function PostContent({
	title,
	text,
	content,
	tags,
	links,
	images,
}: PostContentProps) {
	const rawText = text || content || "";

	const bodyText = tags?.length
		? tags.reduce((acc, tag) => {
				const normalized = tag.startsWith("#") ? tag : `#${tag}`;
				return acc.replace(normalized, "").replace(/\s+/g, " ").trim();
			}, rawText)
		: rawText;

	const renderImages = () => {
		if (!images || images.length === 0) return null;

		const pattern = [2, 3, 2];
		const rows: { id: number; uri: string }[][] = [];
		let index = 0;
		let patternIndex = 0;

		while (index < images.length) {
			const count = pattern[patternIndex % pattern.length];
			rows.push(images.slice(index, index + count));
			index += count;
			patternIndex++;
		}

		return (
			<View style={styles.imagesContainer}>
				{rows.map((row, rowIndex) => (
					<View key={rowIndex} style={styles.imageRow}>
						{row.map((image) => (
							<Image
								key={image.id}
								source={{ uri: image.uri }}
								style={[styles.image, { flex: 1 / row.length }]}
								resizeMode="cover"
							/>
						))}
					</View>
				))}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{title ? <Text style={styles.title}>{title}</Text> : null}
			{bodyText ? <Text style={styles.text}>{bodyText}</Text> : null}

			{renderImages()}

			{tags?.length > 0 && (
				<View style={styles.tagsContainer}>
					{tags.map((tag, index) => (
						<Text key={index} style={styles.tagText}>
							{tag.startsWith("#") ? tag : `#${tag}`}
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
