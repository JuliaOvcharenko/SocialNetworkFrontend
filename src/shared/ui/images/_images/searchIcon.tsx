import { Image, type ImageProps } from "expo-image"


export function SearchIcon(props: ImageProps) {
    return (
        <Image 
            source={require("@assetsIcons/search.png")} 
            style={[{ width:20 , height: 20}, props.style]} 
            {...props} 
        />
    )
}