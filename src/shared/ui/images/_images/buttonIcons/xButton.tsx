import { Image, type ImageProps } from "expo-image"

export function XButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/x.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}