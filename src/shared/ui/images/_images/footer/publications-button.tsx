import { Image, type ImageProps } from "expo-image"


export function publicationButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/publicationIcon.png")} {...props}></Image>
    )
}