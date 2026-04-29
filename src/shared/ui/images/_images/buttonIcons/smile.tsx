import { Image, type ImageProps } from "expo-image"

export function SmileButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/smile.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}