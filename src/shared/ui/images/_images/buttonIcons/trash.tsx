import { Image, type ImageProps } from "expo-image"

export function TrashButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/trash.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}