import { baseApi } from "@shared/api/baseApi";
import {
    CreatePostPayload,
    PaginatedPosts,
    PaginationParams,
    IPost,
} from "../types/post.types";

export const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query<PaginatedPosts, PaginationParams>({
            query: (params) => ({
                url: "posts",
                params,
            }),
            providesTags: ["Post"],
        }),

        getMyPosts: builder.query<PaginatedPosts, PaginationParams>({
            query: (params) => ({
                url: "posts/my",
                params,
            }),
            providesTags: ["Post"],
        }),

        createPost: builder.mutation<IPost, CreatePostPayload>({
            query: (body) => ({
                url: "posts",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Post"],
        }),

        uploadPostImage: builder.mutation<{ url: string }, FormData>({
            query: (body) => ({
                url: "posts/upload",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useGetMyPostsQuery,
    useCreatePostMutation,
    useUploadPostImageMutation,
} = postApi;