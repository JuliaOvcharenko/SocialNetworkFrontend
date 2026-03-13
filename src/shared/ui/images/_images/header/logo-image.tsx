import { Image, type ImageProps } from "expo-image"


export function LogoImage(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/logo.png")} {...props}></Image>
    )
}