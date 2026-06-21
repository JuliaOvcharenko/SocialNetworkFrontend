import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation } from "@modules/auth/api/user-api";
import { BASE_URL } from "@shared/config/api.config";
import { SettingsFormData, settingsSchema } from "../lib/settings.schema";

export function useSettings() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingSignature, setIsEditingSignature] = useState(false);

    const [isAliasSelected, setIsAliasSelected] = useState(true);
    const [isElectronicSelected, setIsElectronicSelected] = useState(true);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    const { control, trigger, formState: { errors }, watch, reset } = useForm<SettingsFormData>({
        resolver: yupResolver(settingsSchema),
        defaultValues: { name: "", surname: "", nickname: "", authorAlias: "", birthDate: "", email: "", password: "", confirmPassword: "" },
    });

    const formatSeparatorDate = (dateStr: string): string => {
        if (!dateStr) return "";

        const d = new Date(dateStr);

        if (isNaN(d.getTime()) || d.getTime() === 0) {
            return "";
        }
        const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    useEffect(() => {
        if (user) {
            reset({
                name: user.firstName || "",
                surname: user.lastName || "",
                email: user.email || "",
                authorAlias: user.profile?.pseudonym || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "",
                nickname: user.username ? (user.username.startsWith("@") ? user.username : `@${user.username}`) : "",
                birthDate: formatSeparatorDate(user.profile?.birthDate!) || "",
                password: "*********",
            });
            if (user.profile?.avatar) setAvatarUri(`${BASE_URL}${user.profile.avatar}`);
        }
        
    }, [user, reset]);

    const pickAvatarImage = async (isReplace: boolean) => {
        if (!isEditingProfile || isUploading) return;
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (result.canceled || !result.assets?.length) return;

        const asset = result.assets[0];
        if (!asset.uri) return;

        const formData = new FormData();
        formData.append("avatar", { uri: asset.uri, name: asset.fileName || "avatar.jpg", type: asset.mimeType || "image/jpeg" } as any);

        try {
            await uploadAvatar({ formData, isMain: true }).unwrap();
        } catch (e) {
            console.log("UPLOAD FAIL:", e);
        }
    };

    const handleProfileEditToggle = async () => {
        if (isEditingProfile) {
            const isValid = await trigger(["authorAlias", "nickname"]);
            if (!isValid) return;
            const values = watch();
            try {
                await updateProfile({ username: values.nickname?.replace("@", "") || "", pseudonym: values.authorAlias }).unwrap();
                setIsEditingProfile(false);
            } catch (e) { console.log("UPDATE PROFILE FAIL:", e); }
        } else setIsEditingProfile(true);
    };

    const handlePersonalEditToggle = async () => {
        if (isEditingPersonal) {
            const isValid = await trigger(["name", "surname", "birthDate", "email"]);
            if (!isValid) return;
            const values = watch();
            try {
                await updateProfile({ firstName: values.name, lastName: values.surname, birthDate: values.birthDate }).unwrap();
                setIsEditingPersonal(false);
            } catch (e) { console.log("UPDATE PERSONAL FAIL:", e); }
        } else setIsEditingPersonal(true);
    };

    const handlePasswordEditToggle = async () => {
        if (isEditingPassword) {
            const isValid = await trigger(["password", "confirmPassword"]);
            if (isValid) setIsEditingPassword(false);
        } else setIsEditingPassword(true);
    };

    return {
        user, isUserLoading, control, errors, watch, avatarUri,
        isEditingProfile, isEditingPersonal, isEditingPassword, isEditingSignature,
        isAliasSelected, setIsAliasSelected, isElectronicSelected, setIsElectronicSelected,
        signatureImage, setSignatureImage,
        pickAvatarImage, handleProfileEditToggle, handlePersonalEditToggle, handlePasswordEditToggle,
        handleSignatureEditToggle: () => setIsEditingSignature(!isEditingSignature)
    };
}