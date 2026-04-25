import { baseApi } from "@shared/api/baseApi";
import {
    Album,
    CreateAlbumPayload,
    UpdateAlbumPayload,
    UpdateAlbumVisibilityPayload,
} from "./api.types";

export const albumApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAlbum: builder.mutation<Album, CreateAlbumPayload>({
            query: (body) => ({
                url: "albums",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Album"],
        }),

        editAlbum: builder.mutation<Album, { id: number } & UpdateAlbumPayload>({
            query: ({ id, ...body }) => ({
                url: `albums/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Album"],
        }),

        editAlbumVisibility: builder.mutation<Album, { id: number } & UpdateAlbumVisibilityPayload>({
            query: ({ id, ...body }) => ({
                url: `albums/${id}/visibility`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Album"],
        }),

        getAlbums: builder.query<Album[], void>({
            query: () => ({
                url: "albums",
            }),
            providesTags: ["Album"],
        }),

        deleteAlbum: builder.mutation<void, number>({
            query: (id) => ({
                url: `albums/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Album"],
        }),
    }),
});

export const {
    useCreateAlbumMutation,
    useEditAlbumMutation,
    useEditAlbumVisibilityMutation,
    useGetAlbumsQuery,
    useDeleteAlbumMutation,
} = albumApi;