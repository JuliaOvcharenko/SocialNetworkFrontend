import { Image, type ImageProps } from "expo-image"

export function EyePButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/eyeP.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}