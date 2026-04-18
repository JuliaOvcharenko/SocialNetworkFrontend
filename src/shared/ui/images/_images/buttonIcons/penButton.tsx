import { Image, type ImageProps } from "expo-image"

export function PenButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/penIcon.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}