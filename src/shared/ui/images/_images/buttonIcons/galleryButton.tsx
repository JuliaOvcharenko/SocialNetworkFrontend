import { Image, type ImageProps } from "expo-image"

export function GalleryButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/gallery.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}