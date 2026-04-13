import { baseApi } from "@shared/api/baseApi";
import { LoginPayload } from "./api.types";


export const loginApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<{ token: string }, LoginPayload>({
			query: (credentials) => ({
				url: "users/login",
				method: "POST",
				body: credentials,
			}),
		}),
	}),
});

export const { useLoginMutation } = loginApi;
