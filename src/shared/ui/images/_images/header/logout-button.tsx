import { Image, type ImageProps } from "expo-image"


export function logoutButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/logoutButton.png")} {...props}></Image>
    )
}