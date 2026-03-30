import { usePathname, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '@shared/ui/images';
import { COLOURS } from '@shared/constants/colours';
import { FONT_SIZE } from '@shared/constants/font-size';

export function Footer() {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <View style={[styles.container, { height: 40 + insets.bottom}]}>
            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/' && router.push('core/')}>
                <View style={[styles.tabItem, { borderTopColor: pathname === 'core/' ? COLOURS.Plum : 'transparent' }]}>
                    <IMAGES.homeButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={1}>Головна</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/publications' && router.push('core/publications')}>
                <View style={[styles.tabItemWide, { borderTopColor: pathname === 'core/publications' ? COLOURS.Plum : 'transparent' }]}>
                    <IMAGES.publicationButton style={styles.icon} />
                    <Text style={styles.label} numberOfLines={2}>Мої публікації</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/friends' && router.push('core/friends')}>
                <View style={[styles.tabItem, { borderTopColor: pathname === 'core/friends' ? COLOURS.Plum : 'transparent' }]}>
                    <IMAGES.friendsButton style={styles.iconSmall} />
                    <Text style={styles.label} numberOfLines={1}>Друзі</Text>
                </View>
            </View>

            <View style={styles.tabWrapper} onTouchEnd={() => pathname !== 'core/chats' && router.push('core/chats')}>
                <View style={[styles.tabItem, { borderTopColor: pathname === 'core/chats' ? COLOURS.Plum : 'transparent' }]}>
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
    },

    tabWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
    },

    tabItem: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
        borderTopWidth: 2,
        gap: 2,
        overflow: 'visible',
    },

    tabItemWide: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
        borderTopWidth: 2,
        gap: 2,
        overflow: 'visible',
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
        marginTop: 0,
    },
});