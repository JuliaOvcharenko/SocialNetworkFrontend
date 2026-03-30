import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<"personal" | "albums">("personal");

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
              <View style={styles.container}>
                  <Header showSettingsButton showCreateButton showLogoutButton />
              <View style={styles.tabsContainer}>
            <TouchableOpacity
                  style={styles.tab}
                  onPress={() => setActiveTab("personal")}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === "personal" && styles.tabTextActive,
                ]}>
                Особиста інформація
              </Text>
              {activeTab === "personal" && <View style={styles.indicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("albums")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "albums" && styles.tabTextActive,
                ]}
              >
                Альбоми
              </Text>
              {activeTab === "albums" && <View style={styles.indicator} />}
            </TouchableOpacity>
          </View>

          {activeTab === "personal" && (
            <View style={styles.content}>
              <Text style={{ fontFamily: "Wals-Bold" }}>Особиста інформація</Text>
            </View>
          )}
          {activeTab === "albums" && (
            <View style={styles.content}>
              <Text>Альбоми</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOURS.Plum50,
    },
    tabsContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: COLOURS.Plum50,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    tab: {
      marginRight: 24,
      paddingVertical: 5,
      position: "relative",
    },
    tabText: {
      fontSize: 14,
      color: "#9E9E9E",
    },
    tabTextActive: {
      color: COLOURS.darkBlue,
      fontWeight: "600",
    },
    indicator: {
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: COLOURS.darkBlue,
      borderRadius: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
  });
