import { Image, type ImageProps } from "expo-image"

export function PlusButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/plus.png")} 
            style={[{ width:40 , height: 40}, props.style]} 
            {...props} 
        />
    )
}