import React from "react";
import { ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { useGetAllFriendsQuery } from "@modules/friends/api/friend.api";
import { getUserFromFriend } from "@modules/friends/lib/friend.utils";

type Props = {
    currentUserId: string | null;
    openModal: (text: string, action: () => void) => void;
    deleteAction: any;
};

export function AllFriendsTab({ currentUserId, openModal, deleteAction }: Props) {
    const { data: friends, isLoading } = useGetAllFriendsQuery();

    if (isLoading) return <ActivityIndicator style={styles.loader} color={COLOURS.Plum} />;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
            {friends?.map((item) => {
                const user = getUserFromFriend(item, currentUserId);
                if (!user) return null;
                return (
                    <FriendCard
                        key={`fr-${item.id}`}
                        user={user}
                        variant="friend"
                        onPrimaryPress={() => {}}
                        onSecondaryPress={() =>
                            openModal("Видалити з друзів?", () =>
                                deleteAction({ id: Number(item.id) })
                            )
                        }
                    />
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loader: { marginTop: 32 },
    contentScroll: { padding: 16, paddingBottom: 100 },
});