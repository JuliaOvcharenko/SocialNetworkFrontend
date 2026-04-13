import { VerifyForm } from "@modules/auth/ui/verify-form";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";


export default function VerifyScreen() {
    const navigation = useNavigation()

    return (
        <View style={{ backgroundColor: "#E9E5EE", flex:1 }}>
            <VerifyForm onBack={() => navigation.goBack()}/>
        </View>
        
    );
}