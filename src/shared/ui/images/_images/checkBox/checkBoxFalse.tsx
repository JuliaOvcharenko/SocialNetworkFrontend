import { Image, type ImageProps } from "expo-image"


export function CheckBoxFalse(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/checkBoxFalse.png")} {...props}></Image>
    )
}