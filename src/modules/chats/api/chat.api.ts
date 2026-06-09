import { baseApi } from "@shared/api/baseApi";
import { IChat, UpdateChatDto } from "./chat.types";

function normalizeChat(chat: any): IChat {
	return {
		...chat,
		lastMessage: chat.messages?.[0] ?? chat.lastMessage ?? null,
	};
}

export const chatsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPersonalChats: builder.query<IChat[], void>({
			query: () => ({ url: "chats/personal-chats" }),
			transformResponse: (res: any[]) => res.map(normalizeChat),
			providesTags: ["Chats"],
		}),

		getGroupChats: builder.query<IChat[], void>({
			query: () => ({ url: "chats/group-chats" }),
			transformResponse: (res: any[]) => res.map(normalizeChat),
			providesTags: ["Chats"],
		}),

		getChatById: builder.query<IChat, number>({
			query: (chatId) => ({ url: `chats/${chatId}` }),
			transformResponse: (res: any) => normalizeChat(res),
			providesTags: ["Chats"],
		}),

		createChat: builder.mutation<IChat, FormData>({
			query: (body) => ({ url: "chats", method: "POST", body }),
			invalidatesTags: ["Chats"],
		}),

		updateChat: builder.mutation<IChat, { id: number; data: FormData }>({
			query: ({ id, data }) => ({
				url: `chats/${id}`,
				method: "PATCH",
				body: data,
				formData: true
			}),
			invalidatesTags: ["Chats"],
		}),

		deleteChat: builder.mutation<void, number>({
			query: (id) => ({ url: `chats/${id}`, method: "DELETE" }),
			invalidatesTags: ["Chats"],
		}),

		leaveChat: builder.mutation<void, { chatId: number }>({
			query: ({ chatId }) => ({
				url: "chats/leave",
				method: "DELETE",
				body: { chatId },
			}),
			invalidatesTags: ["Chats"],
		}),
	}),
});

export const {
	useGetPersonalChatsQuery,
	useGetGroupChatsQuery,
	useGetChatByIdQuery,
	useCreateChatMutation,
	useUpdateChatMutation,
	useDeleteChatMutation,
	useLeaveChatMutation,
} = chatsApi;
