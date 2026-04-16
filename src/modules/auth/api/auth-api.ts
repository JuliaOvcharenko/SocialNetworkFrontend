import { baseApi } from "@shared/api/baseApi";
import { RegPayload, VerifyDTO } from "./api.types";


export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<{ message: string; token: string }, RegPayload>({
			query: (credentials) => ({
				url: "users/register",
				method: "POST",
				body: credentials,
			}),
		}),
		verify: builder.mutation<{ token: string }, VerifyDTO>({
			query: (dto) => ({
				url: "users/verify",
				method: "POST",
				body: dto,
			}),
		}),
	}),
});

export const { useRegisterMutation, useVerifyMutation } = authApi;

