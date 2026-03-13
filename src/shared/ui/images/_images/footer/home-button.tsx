import { Image, type ImageProps } from "expo-image"


export function homeButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/homeIcon.png")} {...props}></Image>
    )
}