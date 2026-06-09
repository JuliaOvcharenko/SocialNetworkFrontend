import { baseApi } from "@shared/api/baseApi";
import { IChat } from "./chat.types";

interface RawChat {
	messages?: IChat["lastMessage"][];
	lastMessage?: IChat["lastMessage"];
	[key: string]: unknown;
}

function normalizeChat(chat: RawChat): IChat {
	return {
		...(chat as unknown as IChat),
		lastMessage: chat.messages?.[0] ?? chat.lastMessage ?? null,
	};
}

export const chatsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPersonalChats: builder.query<IChat[], void>({
			query: () => ({ url: "chats/personal-chats" }),
			transformResponse: (res: RawChat[]) => res.map(normalizeChat),
			providesTags: ["Chats"],
		}),

		getGroupChats: builder.query<IChat[], void>({
			query: () => ({ url: "chats/group-chats" }),
			transformResponse: (res: RawChat[]) => res.map(normalizeChat),
			providesTags: ["Chats"],
		}),

		getChatById: builder.query<IChat, number>({
			query: (chatId) => ({ url: `chats/${chatId}` }),
			transformResponse: (res: RawChat) => normalizeChat(res),
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
				formData: true,
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
