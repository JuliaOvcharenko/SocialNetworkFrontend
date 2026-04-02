import { Image, type ImageProps } from "expo-image"


export function EyeOpen(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/eyeOpen.png")} {...props}></Image>
    )
}