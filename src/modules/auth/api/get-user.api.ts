import { IUser } from "@modules/friends/api/friend.types";
import { baseApi } from "@shared/api/baseApi";

export const getUserByIdApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getUserById: builder.query<IUser, number>({
			query: (id) => ({
				url: `users/${id}`,
			}),
			providesTags: ["User"],
		}),
	}),
});

export const { useGetUserByIdQuery } = getUserByIdApi;
