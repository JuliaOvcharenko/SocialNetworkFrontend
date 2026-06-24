import { useState } from "react";
import {
    useAcceptActionMutation,
    useDeleteActionMutation,
} from "@modules/friends/api/friend.api";

export function useFriendActions() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("");
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const [acceptAction] = useAcceptActionMutation();
    const [deleteAction] = useDeleteActionMutation();

    const openModal = (text: string, action: () => void) => {
        setModalText(text);
        setPendingAction(() => action);
        setModalVisible(true);
    };

    const handleConfirm = () => {
        pendingAction?.();
        setModalVisible(false);
        setPendingAction(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setPendingAction(null);
    };

    return {
        isModalVisible,
        modalText,
        openModal,
        handleConfirm,
        handleCancel,
        acceptAction,
        deleteAction,
    };
}