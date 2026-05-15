import { baseApi } from "@shared/api/baseApi";

export const logoutApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		logout: builder.mutation<{ message: string }, void>({
			query: () => ({
				url: "users/logout",
				method: "POST",
			}),
			invalidatesTags: ["User"],
		}),
	}),
});

export const { useLogoutMutation } = logoutApi;
