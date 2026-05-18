import { baseApi } from "@shared/api/baseApi";
import {
	CreatePostPayload,
	UpdatePostPayload,
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

		updatePost: builder.mutation<
			IPost,
			{ postId: number; body: UpdatePostPayload }
		>({
			query: ({ postId, body }) => ({
				url: `posts/${postId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Post"],
		}),

		deletePost: builder.mutation<{ success: boolean }, number>({
			query: (postId) => ({
				url: `posts/${postId}`,
				method: "DELETE",
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

		getUserPosts: builder.query<
			PaginatedPosts,
			{ userId: number } & PaginationParams
		>({
			query: ({ userId, ...params }) => ({
				url: `posts/${userId}`,
				params,
			}),
			providesTags: ["Post"],
		}),
	}),
});

export const {
	useGetAllPostsQuery,
	useGetMyPostsQuery,
	useCreatePostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useUploadPostImageMutation,
	useGetUserPostsQuery,
} = postApi;
