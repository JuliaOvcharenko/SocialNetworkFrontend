import { baseApi } from "@shared/api/baseApi";
import {
	AcceptActionParams,
	DeleteActionParams,
	FriendsOverview,
	IFriendsRequest,
	IProfileFriend,
	SendRequestPayload,
	IFriendship,
	IUser,
} from "./friend.types";

export const friendsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getRequests: builder.query<IFriendship[], void>({
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

		getAllFriends: builder.query<IFriendship[], void>({
			query: () => ({
				url: "friends",
			}),
			providesTags: ["Friends"],
		}),

		sendRequest: builder.mutation<IFriendsRequest, SendRequestPayload>({
			query: (body) => ({
				url: "friends/requests",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Friends"],
		}),

		acceptAction: builder.mutation<
			{ message: string; data: IProfileFriend },
			AcceptActionParams
		>({
			query: ({ id, type }) => ({
				url: `friends/requests/${id}/accept`,
				method: "POST",
			}),
			invalidatesTags: ["Friends"],
		}),

		deleteAction: builder.mutation<{ message: string }, DeleteActionParams>(
			{
				query: ({ id, type }) => ({
					url:
						type === "request"
							? `friends/requests/${id}`
							: `friends/${id}`,
					method: "DELETE",
				}),
				invalidatesTags: ["Friends"],
			},
		),
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
