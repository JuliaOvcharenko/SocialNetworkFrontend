import { Image, type ImageProps } from "expo-image"

export function PenButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/penIcon.png")} 
            style={[{ width:40 , height: 40}, props.style]} 
            {...props} 
        />
    )
}