import { baseApi } from "@shared/api/baseApi";
import { AcceptActionParams, DeleteActionParams, FriendshipWithProfile, FriendsOverview, IFriendship, IUser, SendRequestPayload } from "./friend.types";


export const friendsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequests: builder.query<FriendshipWithProfile[], void>({
            query: () => ({
                url: "friends/requests",
            }),
            providesTags: ["Friends"],
        }),

        getSuggestions: builder.query<IUser[], void>({
            query: () => ({
                url: "friends/suggestions",
            }),
            providesTags: ["Friends"],
        }),

        getOverview: builder.query<FriendsOverview, void>({
            query: () => ({
                url: "friends/overview",
            }),
            providesTags: ["Friends"],
        }),

        getAllFriends: builder.query<FriendshipWithProfile[], void>({
            query: () => ({
                url: "friends",
            }),
            providesTags: ["Friends"],
        }),

        sendRequest: builder.mutation<IFriendship, SendRequestPayload>({
            query: (body) => ({
                url: "friends/requests",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Friends"],
        }),

        acceptAction: builder.mutation<{ message: string; data: IFriendship }, AcceptActionParams>({
            query: ({ id, type }) => ({
                url: `friends/${id}/accept`,
                method: "POST",
                params: type ? { type } : undefined,
            }),
            invalidatesTags: ["Friends"],
        }),

        deleteAction: builder.mutation<{ message: string }, DeleteActionParams>({
            query: ({ id, type }) => ({
                url: `friends/${id}`,
                method: "DELETE",
                params: type ? { type } : undefined,
            }),
            invalidatesTags: ["Friends"],
        }),
    }),
});

export const {
    useGetRequestsQuery,
    useGetSuggestionsQuery,
    useGetOverviewQuery,
    useGetAllFriendsQuery,
    useSendRequestMutation,
    useAcceptActionMutation,
    useDeleteActionMutation,
} = friendsApi;