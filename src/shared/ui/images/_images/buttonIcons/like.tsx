import { Image, type ImageProps } from "expo-image"

export function LikeButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/like.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}