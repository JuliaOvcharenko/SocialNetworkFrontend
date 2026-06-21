import { usePathname, useRouter } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IMAGES } from "@shared/ui/images";
import { COLOURS } from "@shared/constants/colours";
import { FONT_SIZE } from "@shared/constants/font-size";
import { useGetRequestsQuery } from "@modules/friends/api/friend.api";
import {
    useGetGroupChatsQuery,
    useGetPersonalChatsQuery,
} from "@modules/chats/api/chat.api";
import { useMemo, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Footer() {
    const pathname = usePathname();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: requests = [] } = useGetRequestsQuery();
    
    const [seenRequestIds, setSeenRequestIds] = useState<Set<string>>(new Set());
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('seen_friend_requests').then((storedIds) => {
            if (storedIds) {
                setSeenRequestIds(new Set(JSON.parse(storedIds)));
            }
            setIsStorageLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (pathname.includes("friends") && requests?.length > 0) {
            setSeenRequestIds((prev) => {
                const newSeen = new Set(prev);
                requests.forEach((r) => newSeen.add(String(r.id)));
                AsyncStorage.setItem('seen_friend_requests', JSON.stringify(Array.from(newSeen)));
                return newSeen;
            });
        }
    }, [pathname, requests]);

    const pendingRequestsCount = requests?.filter(
        (r) => !seenRequestIds.has(String(r.id))
    )?.length || 0;

    const { data: personal = [] } = useGetPersonalChatsQuery();
    const { data: group = [] } = useGetGroupChatsQuery();

    const totalUnread = useMemo(() => {
        const sum = (chats: any[]) =>
            chats.reduce((acc, c) => acc + (c._count?.messages ?? 0), 0);
        return sum(personal) + sum(group);
    }, [personal, group]);

    return (
        <View
            style={[
                styles.container,
                { 
                    height: 40 + insets.bottom, 
                    paddingBottom: insets.bottom + 5, 
                    paddingTop: 0 
                },
            ]}
        >
            <View
                style={styles.tabWrapper}
                onTouchEnd={() => pathname !== "core/" && router.push("core/")}
            >
                <View style={styles.tabItem}>
                    <IMAGES.homeButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={1}>
                        Головна
                    </Text>
                </View>
            </View>

            <View
                style={styles.tabWrapper}
                onTouchEnd={() =>
                    pathname !== "core/publications" &&
                    router.push("core/publications")
                }
            >
                <View style={styles.tabItemWide}>
                    <IMAGES.publicationButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={2}>
                        Мої публікації
                    </Text>
                </View>
            </View>

            <View
                style={styles.tabWrapper}
                onTouchEnd={() =>
                    pathname !== "core/friends" && router.push("core/friends")
                }
            >
                <View style={styles.tabItem}>
                    <View style={{ position: "relative" }}>
                        <IMAGES.friendsButton style={styles.iconSmall} />
                        {isStorageLoaded && pendingRequestsCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.label} numberOfLines={1}>
                        Друзі
                    </Text>
                </View>
            </View>

            <View
                style={styles.tabWrapper}
                onTouchEnd={() =>
                    pathname !== "core/chats" && router.push("core/chats")
                }
            >
                <View style={styles.tabItem}>
                    <View style={{ position: "relative" }}>
                        <IMAGES.chatButton style={styles.icon} />
                        {totalUnread > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {totalUnread > 99 ? "99+" : totalUnread}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.label} numberOfLines={1}>
                        Чати
                    </Text>
                </View>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: COLOURS.white,
        borderTopWidth: 0,
        ...Platform.select({
            ios: {
                shadowColor: "transparent",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0,
                shadowRadius: 0,
            },
            android: {
                elevation: 0,
            },
        }),
    },
    tabWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabItem: {
        width: 80,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        borderTopWidth: 2,
        borderColor: "transparent", 
        gap: 4,
    },
    tabItemWide: {
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        borderTopWidth: 2,
        borderColor: "transparent",
        gap: 4,
    },
    icon: {
        width: 16,
        height: 16,
    },
    iconSmall: {
        width: 18,
        height: 14,
    },
    label: {
        textAlign: "center",
        fontSize: FONT_SIZE.font14,
        color: COLOURS.darkBlue,
        fontFamily: "Wals-Medium",
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLOURS.Plum,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
});