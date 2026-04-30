import { Image, type ImageProps } from "expo-image"

export function HeartButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/heart.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}