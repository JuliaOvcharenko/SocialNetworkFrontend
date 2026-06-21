import { Tabs, usePathname } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLOURS } from "@shared/constants/colours";
import { FONT_SIZE } from "@shared/constants/font-size";
import { IMAGES } from "@shared/ui/images";
import {
    useGetGroupChatsQuery,
    useGetPersonalChatsQuery,
} from "@modules/chats/api/chat.api";
import { useGetRequestsQuery } from "@modules/friends/api/friend.api"; 
import { useMemo, useState, useEffect } from "react"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();

    const { data: personal = [] } = useGetPersonalChatsQuery();
    const { data: group = [] } = useGetGroupChatsQuery();

    const totalUnread = useMemo(() => {
        const sum = (chats: any[]) =>
            chats.reduce((acc, c) => acc + (c._count?.messages ?? 0), 0);
        return sum(personal) + sum(group);
    }, [personal, group]);

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

    const unseenRequestsCount = requests?.filter(
        (r) => !seenRequestIds.has(String(r.id))
    )?.length || 0;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 40 + insets.bottom,
                    paddingBottom: insets.bottom + 5,
                    paddingTop: 0,
                },
                tabBarItemStyle: {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItem,
                                {
                                    borderTopColor: focused
                                        ? COLOURS.Plum
                                        : "transparent",
                                },
                            ]}
                        >
                            <IMAGES.homeButton style={styles.icon} />
                            <Text style={styles.label} numberOfLines={1}>
                                Головна
                            </Text>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="publications"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItemWide,
                                {
                                    borderTopColor: focused
                                        ? COLOURS.Plum
                                        : "transparent",
                                },
                            ]}
                        >
                            <IMAGES.publicationButton style={styles.icon} />
                            <Text style={styles.label} numberOfLines={2}>
                                Мої публікації
                            </Text>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="friends"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItem,
                                {
                                    borderTopColor: focused
                                        ? COLOURS.Plum
                                        : "transparent",
                                },
                            ]}
                        >
                            <View style={{ position: "relative" }}>
                                <IMAGES.friendsButton style={styles.iconSmall} />
                                
                                {isStorageLoaded && unseenRequestsCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unseenRequestsCount > 9 ? "9+" : unseenRequestsCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.label} numberOfLines={1}>
                                Друзі
                            </Text>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="chats"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItem,
                                {
                                    borderTopColor: focused
                                        ? COLOURS.Plum
                                        : "transparent",
                                },
                            ]}
                        >
                            <View style={{ position: "relative" }}>
                                <IMAGES.chatButton style={styles.icon} />
                                {totalUnread > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {totalUnread > 99
                                                ? "99+"
                                                : totalUnread}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.label} numberOfLines={1}>
                                Чати
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabItem: {
        width: 80,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        borderTopWidth: 2,
        gap: 4,
    },
    tabItemWide: {
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        borderTopWidth: 2,
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