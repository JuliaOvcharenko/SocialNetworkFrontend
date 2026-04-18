import { baseApi } from "@shared/api/baseApi";
import { User } from "./api.types";

export const userProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "users/me",
            providesTags: ["User"],
        }),

        uploadAvatar: builder.mutation<{ avatar: string }, { formData: FormData; isMain: boolean }>({
            query: ({ formData, isMain }) => ({
                url: `users/avatar?isMain=${isMain}`,
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            }),
            invalidatesTags: ["User"],
        }),

        updateProfile: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: "users/me",
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
    overrideExisting: true,
});

export const { useGetMeQuery, useUploadAvatarMutation, useUpdateProfileMutation } = userProfileApi;