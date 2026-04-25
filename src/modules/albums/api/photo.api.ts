import { baseApi } from "@shared/api/baseApi";

export type PhotoVisibility = "public" | "private";

export interface Photo {
    id:         number;
    albumId:    number;
    userId:     number;
    photoName:  string;
    visibility: PhotoVisibility;
    createdAt:  string;
    updatedAt:  string;
}

export type UpdatePhotoVisibilityPayload = {
    visibility: PhotoVisibility;
};

export const photoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addPhoto: builder.mutation<Photo, { albumId: number; file: FormData }>({
            query: ({ albumId, file }) => ({
                url:    `albums/${albumId}/photos`,
                method: "POST",
                body:   file,
                formData: true,
            }),
            invalidatesTags: ["Photo"],
        }),

        updatePhotoVisibility: builder.mutation<Photo, { albumId: number; photoId: number } & UpdatePhotoVisibilityPayload>({
            query: ({ albumId, photoId, visibility }) => ({
                url:    `albums/${albumId}/photos/${photoId}/visibility`,
                method: "PATCH",
                body:   { visibility },
            }),
            invalidatesTags: ["Photo"],
        }),

        getPhotos: builder.query<Photo[], { albumId: number; page?: number; limit?: number }>({
            query: ({ albumId, page = 1, limit = 20 }) => ({
                url:    `albums/${albumId}/photos`,
                params: { page, limit },
            }),
            providesTags: ["Photo"],
        }),

        deletePhoto: builder.mutation<void, { albumId: number; photoId: number }>({
            query: ({ albumId, photoId }) => ({
                url:    `albums/${albumId}/photos/${photoId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Photo"],
        }),
    }),
});

export const {
    useAddPhotoMutation,
    useUpdatePhotoVisibilityMutation,
    useGetPhotosQuery,
    useDeletePhotoMutation,
} = photoApi;