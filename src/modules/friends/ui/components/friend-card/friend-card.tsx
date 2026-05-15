import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "@shared/ui/button";
import { styles } from "./friend-card.styles";
import { useRouter } from "expo-router";

interface FriendCardProps {
	user: {
		id: number;
		avatarUrl: any;
		name: string;
		alias: string;
		isOnline?: boolean;
	};
	variant: "request" | "recommendation" | "friend";
	onPrimaryPress: () => void;
	onSecondaryPress: () => void;
}

export function FriendCard({
	user,
	variant,
	onPrimaryPress,
	onSecondaryPress,
}: FriendCardProps) {
	const router = useRouter();

	const getPrimaryText = () => {
		if (variant === "request") return "Підтвердити";
		if (variant === "recommendation") return "Додати";
		return "Повідомлення";
	};

	const handleCardPress = () => {
		
		router.push(`/core/${user.id}`);
	};

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={handleCardPress}
			activeOpacity={0.8}
		>
			<View style={styles.avatarContainer}>
				<Image source={user.avatarUrl} style={styles.avatar} />
				<View
					style={[styles.indicator, user.isOnline && styles.online]}
				/>
			</View>

			<Text style={styles.name}>{user.name}</Text>
			<Text style={styles.alias}>{user.alias}</Text>

			<View style={styles.buttonsRow}>
				<View style={styles.btnContainer}>
					<Button
						variant="primary"
						title={getPrimaryText()}
						onPress={(e) => {
							e.stopPropagation?.();
							onPrimaryPress();
						}}
						style={styles.fullWidthBtn}
						textStyle={styles.btnText}
					/>
				</View>
				<View style={styles.btnContainer}>
					<Button
						variant="outline"
						title="Видалити"
						onPress={(e) => {
							e.stopPropagation?.();
							onSecondaryPress();
						}}
						style={styles.fullWidthBtn}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
