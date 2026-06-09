import { baseApi } from "@shared/api/baseApi";
import { IMessage, SendMessageDTO } from "./message.types";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<IMessage[], number>({
            query: (chatId) => ({
                url: `messages/${chatId}`,
            }),
            providesTags: ["Messages"],
        }),
        sendMessage: builder.mutation<IMessage, SendMessageDTO>({
            query: (body) => ({
                url: `messages`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Messages"],
        }),
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;