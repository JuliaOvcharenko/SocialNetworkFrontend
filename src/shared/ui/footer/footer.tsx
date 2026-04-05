import { usePathname, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '@shared/ui/images';
import { COLOURS } from '@shared/constants/colours';
import { FONT_SIZE } from '@shared/constants/font-size';

export function Footer() {
    const pathname = usePathname();
    const router = useRouter();

    // height: 40 + insets.bottom, 
    //                 paddingBottom: insets.bottom + 5,
    //                 paddingTop: 0,

    return (
        <View style={[styles.container, { paddingBottom: 41, minHeight: 30, paddingTop: 10, height: 62, }]}>
            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/' && router.push('core/')}>
                <View style={styles.tabItem}>
                    <IMAGES.homeButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={1}>Головна</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/publications' && router.push('core/publications')}>
                <View style={styles.tabItemWide}>
                    <IMAGES.publicationButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={2}>Мої публікації</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/friends' && router.push('core/friends')}>
                <View style={styles.tabItem}>
                    <IMAGES.friendsButton style={styles.iconSmall} />
                    <Text style={styles.label} numberOfLines={1}>Друзі</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/chats' && router.push('core/chats')}>
                <View style={styles.tabItem}>
                    <IMAGES.chatButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={1}>Чати</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: COLOURS.white,
        borderTopWidth: 0,
        marginTop: -2,
        ...Platform.select({
            ios: {
                shadowColor: 'transparent',
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
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tabItem: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
        gap: 2,
    },
    tabItemWide: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
        gap: 2,
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
        textAlign: 'center',
        fontSize: FONT_SIZE.font14,
        color: COLOURS.darkBlue,
        fontFamily: 'Wals-Medium',
    },
});