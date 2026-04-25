import { Image, type ImageProps } from "expo-image"

export function EyeAlbumButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/eyeAlbum.png")} 
            style={[{ width:40 , height: 40}, props.style]} 
            {...props} 
        />
    )
}