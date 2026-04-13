import { baseApi } from "@shared/api/baseApi";
import { User } from "./api.types";

export const userProfileApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMe: builder.query<User, void>({
			query: () => "users/me",
			providesTags: ["User"],
		}),
	}),
});

export const { useGetMeQuery } = userProfileApi;
