import { Image, type ImageProps } from "expo-image"

export function HeartLikeButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/heartLike.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}