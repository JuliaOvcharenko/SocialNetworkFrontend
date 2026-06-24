import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { useGetSuggestionsQuery } from "@modules/friends/api/friend.api";

type Props = {
    acceptAction: any;
};

export function RecommendationsTab({ acceptAction }: Props) {
    const { data: suggestions, isLoading } = useGetSuggestionsQuery();
    const [hiddenSuggestions, setHiddenSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (suggestions) setHiddenSuggestions([]);
    }, [suggestions]);

    const handleAccept = async (id: string) => {
        try {
            await acceptAction({ id: Number(id) }).unwrap();
        } catch (e) {
            console.error("acceptSuggestion error:", e);
        }
    };

    if (isLoading) return <ActivityIndicator style={styles.loader} color={COLOURS.Plum} />;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
            {suggestions
                ?.filter((user) => !hiddenSuggestions.includes(user.id))
                .map((user) => (
                    <FriendCard
                        key={`rec-${user.id}`}
                        user={user}
                        variant="recommendation"
                        onPrimaryPress={() => handleAccept(user.id)}
                        onSecondaryPress={() => setHiddenSuggestions((prev) => [...prev, user.id])}
                    />
                ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loader: { marginTop: 32 },
    contentScroll: { padding: 16, paddingBottom: 100 },
});