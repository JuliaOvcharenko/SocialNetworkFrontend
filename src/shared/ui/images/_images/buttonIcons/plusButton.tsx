import { Image, type ImageProps } from "expo-image"

export function PlusButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/plus.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}