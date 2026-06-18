import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
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


    const [localIsHearted, setLocalIsHearted] = useState(isHearted);
    const [localHeartsCount, setLocalHeartsCount] = useState(hearts);

    const [localIsLiked, setLocalIsLiked] = useState(isLiked);
    const [localLikesCount, setLocalLikesCount] = useState(likes);

    useEffect(() => {
        setLocalIsHearted(isHearted);
        setLocalHeartsCount(hearts);
    }, [isHearted, hearts]);

    useEffect(() => {
        setLocalIsLiked(isLiked);
        setLocalLikesCount(likes);
    }, [isLiked, likes]);

    const heartScale = useRef(new Animated.Value(1)).current;
    const likeScale = useRef(new Animated.Value(1)).current;

    const animateButton = (animValue: Animated.Value) => {
        Animated.sequence([
            Animated.timing(animValue, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(animValue, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleHeartPress = () => {
        animateButton(heartScale);
        setLocalIsHearted(!localIsHearted);
        setLocalHeartsCount((prev) => (localIsHearted ? prev - 1 : prev + 1));
        toggleHeart(postId); 
    };

    const handleLikePress = () => {
        animateButton(likeScale);
        setLocalIsLiked(!localIsLiked);
        setLocalLikesCount((prev) => (localIsLiked ? prev - 1 : prev + 1));
        toggleLike(postId); 
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={handleHeartPress}
                    activeOpacity={0.7}
                >
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                        {localIsHearted ? (
                            <IMAGES.HeartLikeButton style={styles.icon} />
                        ) : (
                            <IMAGES.HeartButton style={styles.icon} />
                        )}
                    </Animated.View>
                    <Text
                        style={localIsHearted ? styles.actionTextActive : styles.actionText}
                    >
                        {localHeartsCount} Вподобань
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={handleLikePress}
                    activeOpacity={0.7}
                >
                    <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                        <IMAGES.LikeButton
                            style={[
                                styles.icon,
                                localIsLiked && { tintColor: COLOURS.Plum },
                            ]}
                        />
                    </Animated.View>
                    <Text
                        style={localIsLiked ? styles.actionTextActive : styles.actionText}
                    >
                        {localLikesCount} Вподобань
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <View style={styles.actionItem}>
                    <IMAGES.EyePButton style={styles.icon} />
                    <Text style={styles.actionText}>{views} Переглядів</Text>
                </View>
            </View>
        </View>
    );
}