import React, { useState, useEffect } from "react";
import {
    View,
    Platform,
    Keyboard,
    StyleSheet,
    StyleProp,
    ViewStyle,
    KeyboardAvoidingView, 
} from "react-native";

interface KeyboardSafeScreenProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    extraHeight?: number;
}

export function KeyboardSafeScreen({
    children,
    footer,
    style,
    extraHeight = Platform.OS === "ios" ? 90 : 40, 
}: KeyboardSafeScreenProps) {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showListener = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
        const hideListener = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
           style={[styles.container, style]}
            behavior={Platform.OS === "ios" ? "padding" : (isKeyboardVisible ? "padding" : undefined)}
            keyboardVerticalOffset={extraHeight}
        >
            <View style={styles.content}>
                {children}
            </View>

            {footer && (
                <View style={{ display: isKeyboardVisible ? "none" : "flex" }}>
                    {footer}
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});