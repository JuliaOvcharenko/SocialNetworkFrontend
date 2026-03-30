import { Tabs } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLOURS } from "@shared/constants/colours";
import { FONT_SIZE } from "@shared/constants/font-size";
import { IMAGES } from "@shared/ui/images";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70 + insets.bottom,
                    paddingBottom: insets.bottom + 10,
                    paddingTop: 0,
                },
                tabBarItemStyle: {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItem,
                                { borderTopColor: focused ? COLOURS.Plum : "transparent" },
                            ]}>
                            <IMAGES.homeButton style={styles.icon} />
                            <Text style={styles.label} numberOfLines={1}>
                                Головна
                            </Text>
                        </View>
                    ),
                }}/>

            <Tabs.Screen
                name="publications"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItemWide,
                                { borderTopColor: focused ? COLOURS.Plum : "transparent" },
                            ]}>
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
                                { borderTopColor: focused ? COLOURS.Plum : "transparent" },
                            ]}>
                            <IMAGES.friendsButton style={styles.iconSmall} />
                            <Text style={styles.label} numberOfLines={1}>
                                Друзі
                            </Text>
                        </View>
                    ),
                }}/>

            <Tabs.Screen
                name="chats"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.tabItem,
                                { borderTopColor: focused ? COLOURS.Plum : "transparent" },
                            ]}
                        >
                            <IMAGES.chatButton style={styles.icon} />
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
});