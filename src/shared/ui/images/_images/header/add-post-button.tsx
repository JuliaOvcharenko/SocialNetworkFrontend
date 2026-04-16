import { Image, type ImageProps } from "expo-image"


export function AddPostButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/addPostButton.png")} {...props}></Image>
    )
}