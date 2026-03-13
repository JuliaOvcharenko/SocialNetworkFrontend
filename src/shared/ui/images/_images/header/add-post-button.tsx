import { Image, type ImageProps } from "expo-image"


export function addPostButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/addPostButton.png")} {...props}></Image>
    )
}