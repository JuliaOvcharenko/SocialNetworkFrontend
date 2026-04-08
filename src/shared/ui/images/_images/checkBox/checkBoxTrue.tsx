import { Image, type ImageProps } from "expo-image"


export function CheckBoxTrue(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/checkBoxTrue.png")} {...props}></Image>
    )
}