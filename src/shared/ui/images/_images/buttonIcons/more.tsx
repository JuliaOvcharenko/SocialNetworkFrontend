import { Image, type ImageProps } from "expo-image"

export function MoreButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/more.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}