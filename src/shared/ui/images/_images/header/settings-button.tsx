import { Image, type ImageProps } from "expo-image"


export function settingsButton(props: ImageProps){
    return (
        <Image source = {require("@assetsIcons/settingButton.png")} {...props}></Image>
    )
}