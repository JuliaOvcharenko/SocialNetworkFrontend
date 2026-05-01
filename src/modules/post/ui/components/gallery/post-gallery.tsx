import React from "react";
import { View, Image, StyleProp, ImageStyle } from "react-native";
import { styles } from "./post-gallery.styles";
import { photoUri } from "../../../../../app/core/(notab)/albums";

interface PostGalleryProps {
	images: any[];
}

export function PostGallery({ images }: PostGalleryProps) {
	const validImages = (images ?? []).filter((img) => {
		const uri = photoUri(typeof img === 'string' ? img : img?.shakalImageURL ?? img?.url ?? '');
		return uri.length > 0;
	});

	if (validImages.length === 0) return null;

	const getRows = (imgs: any[]) => {
		const len = imgs.length;
		if (len === 1) return [[imgs[0]]];
		if (len === 2) return [[imgs[0], imgs[1]]];
		if (len === 3) return [[imgs[0], imgs[1], imgs[2]]];
		if (len === 4)
			return [
				[imgs[0], imgs[1]],
				[imgs[2], imgs[3]],
			];

		const rows = [];
		let i = 0;
		let takeTwo = true;
		while (i < len) {
			const chunkSize = takeTwo ? 2 : 3;
			rows.push(imgs.slice(i, i + chunkSize));
			i += chunkSize;
			takeTwo = !takeTwo;
		}
		return rows;
	};

	const rows = getRows(validImages);

	return (
		<View style={styles.container}>
			{rows.map((row, rowIndex) => (
				<View key={rowIndex} style={styles.row}>
					{row.map((img, imgIndex) => {
						let imgStyle: StyleProp<ImageStyle>;
						if (row.length === 2) imgStyle = styles.imageHalf;
						else if (row.length === 3) imgStyle = styles.imageThird;
						else imgStyle = styles.imageSingle;

						const uri = photoUri(typeof img === 'string' ? img : img?.shakalImageURL ?? img?.url ?? '');

						return (
							<Image
								key={imgIndex}
								source={{ uri }}
								style={imgStyle}
							/>
						);
					})}
				</View>
			))}
		</View>
	);
}
