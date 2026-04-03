import { Footer } from '@shared/ui/footer';
import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function NoTabLayout() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Slot />
            </View>
            <View style={styles.footerWrapper}>
                <Footer />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    footerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
    },
});