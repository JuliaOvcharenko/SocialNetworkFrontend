import { Image, type ImageProps } from "expo-image"

export function TrashAlbumButton(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/trashAlbum.png")} 
            style={[{ width:40 , height: 40}, props.style]} 
            {...props} 
        />
    )
}