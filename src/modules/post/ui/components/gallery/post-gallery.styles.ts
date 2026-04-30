import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8, 
    },
    imageSingle: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        resizeMode: 'cover',
    },
    imageHalf: {
        flex: 1, 
        height: 200,
        borderRadius: 16,
        resizeMode: 'cover',
    },
    imageThird: {
        flex: 1, 
        height: 140,
        borderRadius: 16,
        resizeMode: 'cover',
    }
});