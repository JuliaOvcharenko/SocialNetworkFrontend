import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Image,
    ScrollView,
} from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Button } from "@shared/ui/button";
import { IMAGES } from "@shared/ui/images";
import { Input } from "@shared/ui/input";
import { IUser } from "@modules/friends/api/friend.types";
import { BASE_URL } from "@shared/config/api.config";

export interface GroupDetailsData {
    name: string;
}

interface GroupDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    selectedUsers: IUser[];
    onRemoveUser: (id: string) => void;
    onAddMore: () => void;
    onSubmit: (data: GroupDetailsData) => void;
    title: string;
    buttonText: string;
    initialName?: string;
    groupPhotoUri?: string | null;
    onAddPhoto?: () => void;
    onReplacePhoto?: () => void;
}

function resolveAvatar(avatar: string | null | undefined): string | null {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar.replace(/^https?:\/\/[^/]+/, BASE_URL);
    const filename = avatar.split("/").pop();
    return `${BASE_URL}/media/shakal/${filename}`;
}

const UserRow = React.memo(
    ({ item, onRemove }: { item: IUser; onRemove: (id: string) => void }) => {
        const avatarUri = resolveAvatar(item.profile?.avatar);

        return (
            <View style={styles.userRow}>
                <View style={styles.avatarContainer}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {(item.firstName ?? item.username ?? "?").charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View
                        style={[
                            styles.statusIndicator,
                            { backgroundColor: item.isOnline ? COLOURS.Green100 : COLOURS.Blue20 },
                        ]}
                    />
                </View>
                <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
                    <IMAGES.TrashButton style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
        );
    },
    (prev, next) => prev.item.id === next.item.id,
);

export function GroupDetailsModal({
    visible,
    onClose,
    selectedUsers,
    onRemoveUser,
    onAddMore,
    onSubmit,
    title,
    buttonText,
    initialName = "",
    groupPhotoUri,
    onAddPhoto,
    onReplacePhoto,
}: GroupDetailsModalProps) {
    const [groupName, setGroupName] = useState(initialName);

    useEffect(() => {
        if (visible) setGroupName(initialName);
    }, [visible, initialName]);

    const handleSubmit = () => {
        if (groupName.trim() === "") return;
        onSubmit({ name: groupName.trim() });
        setGroupName("");
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={() => {}}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <IMAGES.XButton style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputSection}>
                        <Input
                            label="Назва"
                            placeholder="Введіть назву"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                    </View>

                    <View style={styles.photoSection}>
                        {groupPhotoUri ? (
                            <Image source={{ uri: groupPhotoUri }} style={styles.photoImage} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Text style={styles.photoPlaceholderText}>
                                    {groupName.length > 0 ? groupName.substring(0, 2).toUpperCase() : "НГ"}
                                </Text>
                            </View>
                        )}
                        <View style={styles.photoActions}>
                            <TouchableOpacity style={styles.photoActionBtn} onPress={onAddPhoto}>
                                <IMAGES.PlusButton style={{ width: 18, height: 18 }} />
                                <Text style={styles.photoActionText}>Додайте фото</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoActionBtn} onPress={onReplacePhoto}>
                                <IMAGES.GalleryButton style={{ width: 18, height: 18 }} />
                                <Text style={styles.photoActionText}>Оберіть фото</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.membersSection}>
                        <View style={styles.membersHeader}>
                            <Text style={styles.membersTitle}>Учасники</Text>
                            <TouchableOpacity style={styles.addMemberBtn} onPress={onAddMore}>
                                <IMAGES.PlusButton style={{ width: 18, height: 18 }} />
                                <Text style={styles.addMemberText}>Додайте учасника</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.usersList}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            {selectedUsers.map((item) => (
                                <UserRow key={item.id} item={item} onRemove={onRemoveUser} />
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Назад"
                            variant="outline"
                            onPress={onClose}
                            style={styles.cancelBtn}
                            textStyle={styles.cancelBtnText}
                        />
                        <Button
                            title={buttonText}
                            variant="primary"
                            onPress={handleSubmit}
                            disabled={groupName.trim() === ""}
                            style={[styles.saveBtn, groupName.trim() === "" && styles.saveBtnDisabled]}
                            textStyle={styles.saveBtnText}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    modalContent: {
        width: "100%",
        maxWidth: 400,
        maxHeight: "90%",
        backgroundColor: COLOURS.white,
        borderRadius: 25,
        padding: 20,
        elevation: 10,
        shadowColor: COLOURS.Black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    avatarContainer: {
        position: "relative",
        marginRight: 12,
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    header: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 20,
    },
    title: {
        marginTop: 20,
        fontSize: 34,
        fontFamily: "Wals-Medium",
        color: COLOURS.darkBlue,
    },
    closeBtn: {
        position: "absolute",
        right: 5,
        top: -10,
    },
    inputSection: {
        marginBottom: 24,
        width: "100%",
    },
    photoSection: {
        alignItems: "center",
        marginBottom: 24,
        marginTop: -10,
    },
    photoImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 12,
    },
    photoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLOURS.Plum,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    photoPlaceholderText: {
        color: COLOURS.white,
        fontSize: 16,
        fontFamily: "Wals-Medium",
    },
    photoActions: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    photoActionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    photoActionText: {
        fontSize: 14,
        fontFamily: "Wals-Medium",
        color: COLOURS.Plum,
    },
    membersSection: {
        width: "100%",
        marginTop: 10,
        minHeight: 80,
        maxHeight: 220,
    },
    membersHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    membersTitle: {
        fontSize: 18,
        fontFamily: "Wals-Medium",
        color: COLOURS.darkBlue,
    },
    usersList: {
        flexGrow: 0,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: COLOURS.Plum50,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLOURS.Plum,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: COLOURS.white,
        fontSize: 16,
        fontFamily: "Wals-Medium",
    },
    statusIndicator: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: COLOURS.white,
    },
    userName: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Wals-Medium",
        color: COLOURS.darkBlue,
    },
    removeBtn: {
        padding: 5,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 15,
        paddingTop: 15,
    },
    cancelBtn: {
        flex: 0.2,
        width: "auto",
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLOURS.Plum,
        backgroundColor: COLOURS.white,
    },
    cancelBtnText: {
        fontSize: 14,
        fontFamily: "Wals-Medium",
        color: COLOURS.Plum,
    },
    saveBtn: {
        flex: 0.5,
        width: "auto",
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: COLOURS.Plum,
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
    saveBtnText: {
        fontSize: 14,
        fontFamily: "Wals-Medium",
        color: COLOURS.white,
    },
    addMemberBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    addMemberText: {
        fontSize: 14,
        fontFamily: "Wals-Medium",
        color: COLOURS.Plum,
    },
});