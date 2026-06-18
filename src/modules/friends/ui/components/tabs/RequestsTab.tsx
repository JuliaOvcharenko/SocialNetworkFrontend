import React from "react";
import { ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { useGetRequestsQuery } from "@modules/friends/api/friend.api";
import { getUserFromRequest } from "@modules/friends/lib/friend.utils";

type Props = {
    openModal: (text: string, action: () => void) => void;
    acceptAction: any;
    deleteAction: any;
};

export function RequestsTab({ openModal, acceptAction, deleteAction }: Props) {
    const { data: requests, isLoading } = useGetRequestsQuery();

    if (isLoading) return <ActivityIndicator style={styles.loader} color={COLOURS.Plum} />;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
            {requests?.map((item) => {
                const user = getUserFromRequest(item);
                if (!user) return null;
                return (
                    <FriendCard
                        key={`req-${item.id}`}
                        user={user}
                        variant="request"
                        onPrimaryPress={() => acceptAction({ id: Number(item.id) })}
                        onSecondaryPress={() =>
                            openModal("Відхилити запит?", () =>
                                deleteAction({ id: Number(item.id), type: "request" })
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