import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GalleryButton } from "@shared/ui/images/_images/buttonIcons/galleryButton";
import { AddPostButton } from "@shared/ui/images/_images/header/add-post-button";
import { Image } from "expo-image";
import { useState, useCallback } from "react";
import {
    useGetAlbumsQuery,
    useCreateAlbumMutation,
    useEditAlbumVisibilityMutation,
    useDeleteAlbumMutation,
} from "@modules/albums/api/album.api";
import * as ImagePicker from "expo-image-picker";
import {
    useAddPhotoMutation,
    useDeletePhotoMutation,
    useGetPhotosQuery,
    useUpdatePhotoVisibilityMutation,
    Photo,
} from "@modules/albums/api/photo.api";
import { CreateAlbumModal } from "@modules/albums/ui/create-album-modal";
import { BASE_URL } from "@shared/config/api.config";
import { AlbumAvatar } from "@modules/albums/api/api.types";
import { EyeAlbumButton } from "@shared/ui/images/_images/buttonIcons/eyeAlbum";
import { TrashAlbumButton } from "@shared/ui/images/_images/buttonIcons/trashAlbum";
import { PlusButton } from "@shared/ui/images/_images/buttonIcons/plusButton";

export function photoUri(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const filename = url.split("/").pop();
    return `${BASE_URL}/media/shakal/${filename}`;
}


interface AlbumDotsModalProps {
    visible: boolean;
    isPublic: boolean;
    onClose: () => void;
    onToggleVisibility: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function AlbumDotsModal({ visible, isPublic, onClose, onToggleVisibility, onEdit, onDelete }: AlbumDotsModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} style={{maxWidth:200}}>
            <Pressable style={dotsModalStyles.backdrop} onPress={onClose}>
                <Pressable style={dotsModalStyles.menu} onPress={(e) => e.stopPropagation()}>
                    <TouchableOpacity
                        style={dotsModalStyles.menuItem}
                        onPress={() => { onToggleVisibility(); onClose(); }}
                    >
                        <Text style={dotsModalStyles.menuItemText}>
                            {isPublic ? "Цей альбом бачите тільки ви" : "Цей альбом бачать усі"}
                        </Text>
                    </TouchableOpacity>

                    <View style={dotsModalStyles.divider} />

                    <TouchableOpacity
                        style={dotsModalStyles.menuItem}
                        onPress={() => { onEdit(); onClose(); }}
                    >
                        <Text style={dotsModalStyles.menuItemText}>Редагувати альбом</Text>
                    </TouchableOpacity>

                    <View style={dotsModalStyles.divider} />

                    <TouchableOpacity
                        style={dotsModalStyles.menuItem}
                        onPress={() => { onDelete(); onClose(); }}
                    >
                        <Text style={[dotsModalStyles.menuItemText, { color: "#E53935" }]}>
                            Видалити альбом
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const dotsModalStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    menu: {
        backgroundColor: "#FFFFFF",
        marginTop: 210,
        marginHorizontal: 1,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 14,
        backgroundColor: "#fff",
    },
    iconWrap: {
        width: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    menuIcon: {
        fontSize: 16,
    },
    menuItemText: {
        fontSize: 14,
        color: "#1A1A2E",
        fontWeight: "400",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#EEECF5",
        marginHorizontal: 20,
    },
});


function AvatarStrip({ avatars, onDeletePhoto }: {
    avatars: AlbumAvatar[];
    onDeletePhoto: (photoId: number) => void;
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoRow}
        >
            {avatars.map((albumAvatar) => (
                <View key={albumAvatar.id} style={styles.photoCard}>
                    <Image
                        source={
                            albumAvatar.avatar.image.shakalImageURL
                                ? { uri: photoUri(albumAvatar.avatar.image.shakalImageURL) }
                                : undefined
                        }
                        style={styles.photoCardImage}
                        contentFit="cover"
                        transition={200}
                    />
                    <View style={styles.photoCardOverlay}>
                        <TouchableOpacity style={styles.photoIconBtn}>
                            <EyeAlbumButton />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.photoIconBtn}
                            onPress={() =>
                                Alert.alert("Видалити фото?", undefined, [
                                    { text: "Скасувати", style: "cancel" },
                                    {
                                        text: "Видалити",
                                        style: "destructive",
                                        onPress: () => onDeletePhoto(albumAvatar.id),
                                    },
                                ])
                            }
                        >
                            <TrashAlbumButton />
                        </TouchableOpacity>
                    </View>
                    {albumAvatar.avatar.isActive && <View style={styles.activeDot} />}
                </View>
            ))}
        </ScrollView>
    );
}


interface PhotoStripProps {
    albumId: number;
    onDeletePhoto: (albumId: number, photoId: number) => void;
    onAddPhoto: (albumId: number) => void;
    onToggleVisibility: (photo: Photo) => void;
}

function PhotoStrip({ albumId, onDeletePhoto, onAddPhoto, onToggleVisibility }: PhotoStripProps) {
    const { data: photos = [], isLoading } = useGetPhotosQuery({ albumId });

    if (isLoading) {
        return <ActivityIndicator color={COLOURS.Plum} style={{ marginTop: 12, alignSelf: "flex-start" }} />;
    }

    return (
        <View style={styles.photoGridSection}>
            <Text style={styles.photoGridLabel}>Фотографії</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoRow}
            >
                {photos.map((photo) => (
                    <TouchableOpacity
                        key={photo.id}
                        activeOpacity={0.85}
                        style={styles.photoCard}
                        onLongPress={() =>
                            Alert.alert("Дії з фото", undefined, [
                                { text: "Скасувати", style: "cancel" },
                                {
                                    text: photo.visibility === "public" ? "Зробити приватним" : "Зробити публічним",
                                    onPress: () => onToggleVisibility(photo),
                                },
                                {
                                    text: "Видалити",
                                    style: "destructive",
                                    onPress: () => onDeletePhoto(photo.albumId, photo.id),
                                },
                            ])
                        }
                    >
                        <Image
                            source={photo.photoName ? { uri: photoUri(photo.photoName) } : undefined}
                            style={styles.photoCardImage}
                            contentFit="cover"
                            transition={200}
                        />
                        <View style={styles.photoCardOverlay}>
                            <TouchableOpacity style={styles.photoIconBtn}>
                                <EyeAlbumButton />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.photoIconBtn}
                                onPress={() =>
                                    Alert.alert("Видалити фото?", undefined, [
                                        { text: "Скасувати", style: "cancel" },
                                        {
                                            text: "Видалити",
                                            style: "destructive",
                                            onPress: () => onDeletePhoto(photo.albumId, photo.id),
                                        },
                                    ])
                                }
                            >
                                <TrashAlbumButton />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addPhotoCard} onPress={() => onAddPhoto(albumId)}>
                    <PlusButton />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default function AlbumsScreen() {
    const router = useRouter();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [expandedAlbumId, setExpandedAlbumId] = useState<number | null>(null);
    const [dotsModal, setDotsModal] = useState<{
        visible: boolean;
        albumId: number | null;
        visibility: "public" | "private";
    }>({ visible: false, albumId: null, visibility: "public" });

    const { data: albums = [], isLoading: albumsLoading } = useGetAlbumsQuery();

    const systemAlbum = albums.find((a) => a.type === "system");
    const customAlbums = albums.filter((a) => a.type === "custom");

    const [createAlbum] = useCreateAlbumMutation();
    const [editAlbumVisibility] = useEditAlbumVisibilityMutation();
    const [deleteAlbum] = useDeleteAlbumMutation();
    const [addPhoto] = useAddPhotoMutation();
    const [deletePhoto] = useDeletePhotoMutation();
    const [updatePhotoVisibility] = useUpdatePhotoVisibilityMutation();

    const handleAddPhoto = useCallback(async (albumId: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
        });

        if (result.canceled || !result.assets?.length) return;
        const asset = result.assets[0];
        if (!asset.uri) return;

        const formData = new FormData();
        formData.append("photo", {
            uri: asset.uri,
            name: asset.fileName || "photo.jpg",
            type: asset.mimeType || "image/jpeg",
        } as any);

        try {
            await addPhoto({ albumId, file: formData }).unwrap();
        } catch (e) {
            console.log("UPLOAD ERROR:", e);
        }
    }, [addPhoto]);

    const handleDeletePhoto = useCallback(async (albumId: number, photoId: number) => {
        try {
            await deletePhoto({ albumId, photoId }).unwrap();
        } catch (e) {
            console.error(e);
        }
    }, [deletePhoto]);

    const handleTogglePhotoVisibility = useCallback(async (photo: Photo) => {
        try {
            await updatePhotoVisibility({
                albumId: photo.albumId,
                photoId: photo.id,
                visibility: photo.visibility === "public" ? "private" : "public",
            }).unwrap();
        } catch (e) {
            console.error(e);
        }
    }, [updatePhotoVisibility]);

    const handleDotsToggleVisibility = useCallback(async () => {
        if (!dotsModal.albumId) return;
        try {
            await editAlbumVisibility({
                id: dotsModal.albumId,
                visibility: dotsModal.visibility === "public" ? "private" : "public",
            }).unwrap();
        } catch (e) {
            console.error(e);
        }
    }, [dotsModal, editAlbumVisibility]);

    const handleDotsDelete = useCallback(() => {
        if (!dotsModal.albumId) return;
        const albumId = dotsModal.albumId;
        Alert.alert("Видалити альбом?", "Всі фото буде втрачено", [
            { text: "Скасувати", style: "cancel" },
            {
                text: "Видалити",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteAlbum(albumId).unwrap();
                        if (expandedAlbumId === albumId) setExpandedAlbumId(null);
                    } catch (e) {
                        console.error(e);
                    }
                },
            },
        ]);
    }, [dotsModal, deleteAlbum, expandedAlbumId]);

    const toggleAlbum = (id: number) =>
        setExpandedAlbumId((prev) => (prev === id ? null : id));

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
            <View style={styles.container}>
                <Header showSettingsButton showCreateButton showLogoutButton />

                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => router.push("/core/settings")}>
                        <Text style={styles.tabText}>Особиста інформація</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={[styles.tabText, styles.tabTextActive]}>Альбоми</Text>
                        <View style={styles.indicator} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {systemAlbum && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Мої фото</Text>
                                <TouchableOpacity
                                    style={styles.addPhotoBtn}
                                    onPress={() => handleAddPhoto(systemAlbum.id)}
                                >
                                    <GalleryButton style={styles.addPhotoBtnIcon} />
                                    <Text style={styles.addPhotoBtnText}>Додати фото</Text>
                                </TouchableOpacity>
                            </View>

                            {systemAlbum.avatars.length === 0 ? (
                                <Text style={styles.emptyText}>Фото поки немає</Text>
                            ) : (
                                <AvatarStrip
                                    avatars={systemAlbum.avatars}
                                    onDeletePhoto={(photoId) => handleDeletePhoto(systemAlbum.id, photoId)}
                                />
                            )}
                        </View>
                    )}

                    {albumsLoading ? (
                        <ActivityIndicator color={COLOURS.Plum} style={{ marginTop: 24 }} />
                    ) : (
                        <>
                            {customAlbums.map((album) => {
                                const isExpanded = expandedAlbumId === album.id;
                                return (
                                    <View key={album.id} style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <View>
                                                <Text style={styles.cardTitle}>{album.name}</Text>
                                                {album.tag && (
                                                    <Text style={styles.albumMeta}>{album.tag}</Text>
                                                )}
                                            </View>

                                            <View style={styles.albumHeaderActions}>
                                                <TouchableOpacity
                                                    style={styles.iconCircleBtn}
                                                    onPress={() => toggleAlbum(album.id)}
                                                >
                                                    <EyeAlbumButton />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.dotsBtn}
                                                    onPress={() =>
                                                        setDotsModal({
                                                            visible: true,
                                                            albumId: album.id,
                                                            visibility: album.visibility ?? "public",
                                                        })
                                                    }
                                                >
                                                    <Text style={styles.dotsBtnText}>⋮</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {isExpanded && (
                                            <PhotoStrip
                                                albumId={album.id}
                                                onDeletePhoto={handleDeletePhoto}
                                                onAddPhoto={handleAddPhoto}
                                                onToggleVisibility={handleTogglePhotoVisibility}
                                            />
                                        )}
                                    </View>
                                );
                            })}

                            <View style={styles.newAlbumBtn}>
                                <Text style={styles.newAlbumBtnText}>
                                    {customAlbums.length === 0 ? "Немає ще жодного альбому" : "Створити альбом"}
                                </Text>
                                <TouchableOpacity
                                    style={styles.newAlbumOpen}
                                    onPress={() => setIsCreateModalVisible(true)}
                                >
                                    <AddPostButton style={{ width: 40, height: 40 }} />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>

                <CreateAlbumModal
                    isVisible={isCreateModalVisible}
                    onClose={() => setIsCreateModalVisible(false)}
                    onSave={async (data) => {
                        try {
                            await createAlbum(data).unwrap();
                            setIsCreateModalVisible(false);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                />

                <AlbumDotsModal
                    visible={dotsModal.visible}
                    isPublic={dotsModal.visibility === "public"}
                    onClose={() => setDotsModal((s) => ({ ...s, visible: false }))}
                    onToggleVisibility={handleDotsToggleVisibility}
                    onEdit={() => console.log("edit", dotsModal.albumId)}
                    onDelete={handleDotsDelete}
                />
            </View>
        </SafeAreaView>
    );
}

const PHOTO_CARD_SIZE = 170;
const SMALL_PHOTO_SIZE = 150;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOURS.Plum50 },

    tabsContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 6,
    },
    tab: { marginRight: 24 },
    tabText: { fontSize: 16, color: COLOURS.Gray50 },
    tabTextActive: { fontWeight: "700", color: COLOURS.darkBlue },
    indicator: { height: 2, backgroundColor: COLOURS.darkBlue, marginTop: 4 },

    scrollContent: { paddingBottom: 100, paddingTop: 12 },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 1,
        borderColor: COLOURS.Gray,
        borderWidth: 0.7,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A2E" },
    albumMeta: { fontSize: 13, color: COLOURS.Gray50, marginTop: 2 },

    addPhotoBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLOURS.Plum,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 7,
    },
    addPhotoBtnIcon: { width: 19, height: 19 },
    addPhotoBtnText: { fontSize: 13, color: COLOURS.Plum, fontWeight: "500" },

    photoRow: {
        paddingTop: 12,
        paddingRight: 8,
        alignItems: "flex-start",
    },

    photoCard: {
        width: PHOTO_CARD_SIZE,
        height: PHOTO_CARD_SIZE,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 10,
        backgroundColor: "#EDE8F5",
        position: "relative",
    },
    photoCardImage: { width: "100%", height: "100%" },

    photoCardOverlay: {
        position: "absolute",
        bottom: 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 15,
        marginHorizontal: 8,
    },

    photoIconBtn: {
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },

    activeDot: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLOURS.Plum,
        borderWidth: 1.5,
        borderColor: "#fff",
    },

    addPhotoCard: {
        width: SMALL_PHOTO_SIZE,
        height: SMALL_PHOTO_SIZE,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E0DCF0",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAFAFA",
        marginRight: 10,
    },

    photoGridSection: { marginTop: 8 },
    photoGridLabel: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 2 },

    albumHeaderActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconCircleBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: "#E0DCF0",
        alignItems: "center",
        justifyContent: "center",
    },
    dotsBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
    dotsBtnText: { fontSize: 22, color: COLOURS.Gray50, lineHeight: 24 },

    newAlbumBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 13,
        marginTop: 3,
        gap: 10,
        backgroundColor: "white",
        borderColor: COLOURS.Blue20,
        borderWidth: 0.7,
        borderRadius: 14,
    },
    newAlbumBtnText: { color: COLOURS.darkBlue, fontWeight: "500", fontSize: 15 },
    newAlbumOpen: {
        alignItems: "center",
        justifyContent: "flex-end",
        marginHorizontal: 2,
    },

    emptyText: { color: COLOURS.Gray50, fontSize: 13, marginTop: 12, textAlign: "center" },
});