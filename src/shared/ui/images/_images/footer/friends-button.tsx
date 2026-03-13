import { Image, type ImageProps } from "expo-image"


export function friendsButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/friendsIcon.png")} {...props}></Image>
    )
}