import { Image, type ImageProps } from "expo-image"


export function EyeClose(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/eyeClose.png")} {...props}></Image>
    )
}