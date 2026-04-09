import { Image, type ImageProps } from "expo-image"

export function GalleryButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/gallery.png")} 
            style={[{ width:40 , height: 40}, props.style]} 
            {...props} 
        />
    )
}