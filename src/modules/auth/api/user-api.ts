import { baseApi } from "@shared/api/baseApi";
import { User } from "./api.types";

export const userProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "users/me",
            providesTags: ["User"],
        }),
        
        //мутация для загрузки аватарки
        uploadAvatar: builder.mutation<{ avatar: string }, FormData>({
            query: (formData) => ({
                url: "users/avatar", 
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["User"], 
        }),
    }),
});

export const { useGetMeQuery, useUploadAvatarMutation } = userProfileApi;