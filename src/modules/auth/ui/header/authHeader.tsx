import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./authHeader.styles";
import { useRouter } from "expo-router";
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images";


export function AuthHeader() {
	const router = useRouter();
	return (
		<SafeAreaView edges={["top"]} style={{backgroundColor: COLOURS.white}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.navigate('core/')}>
                    <IMAGES.LogoImage style={{width: 145, height: 18 }}/>
                </TouchableOpacity>
            </View>
		</SafeAreaView>
	);
}