import { Image, type ImageProps } from "expo-image"

export function HandButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/hand.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}