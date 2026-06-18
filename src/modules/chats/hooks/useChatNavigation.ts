import { useRouter } from "expo-router";
import { 
    useGetPersonalChatsQuery, 
    useCreateChatMutation 
} from "@modules/chats/api/chat.api";

export function useChatNavigation() {
    const router = useRouter();
    
    const { data: personalChats = [] } = useGetPersonalChatsQuery();
    const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

    const navigateToChat = async (friendId: string | number) => {

        const existingChat = personalChats.find((chat: any) => {
            const chatUsers = chat.users || chat.participants || [];
            return chatUsers.some((user: any) => String(user.id) === String(friendId));
        });

        if (existingChat) {
            router.push(`/core/chat?id=${existingChat.id}&fromTab=messages`);
        } else {
            try {

                const formData = new FormData();
                

                formData.append("userIds", String(friendId)); 
                formData.append("isGroup", "false"); 

                const chat = await createChat(formData).unwrap();
                

                router.push(`/core/chat?id=${chat.id}&fromTab=messages`);
            } catch (error) {
                console.error("Помилка створення чату:", error);
            }
        }
    };

    return { navigateToChat, isCreating };
}