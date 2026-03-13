import { Image, type ImageProps } from "expo-image"


export function chatButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/chatIcon.png")} {...props}></Image>
    )
}