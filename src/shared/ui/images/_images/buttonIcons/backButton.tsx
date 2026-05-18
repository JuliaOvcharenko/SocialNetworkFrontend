import { Image, type ImageProps } from "expo-image"

export function BackButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/back.png")} 
            style={[{ width:10 , height: 13}, props.style]} 
            {...props} 
        />
    )
}