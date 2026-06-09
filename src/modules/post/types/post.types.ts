export interface IUser {
	id: number;
	username: string;
	avatarUrl: string | null;
	isOnline?: boolean;
	signatureUrl?: string | null;
}

export interface IPost {
	id: number;
	author: IUser;
	title: string;
	topic: string | null;
	content: string;
	tags: string[];
	images: {
		id: number;
		originalImage: string;
		compressedImage: string;
	}[];
	links: { id: number; url: string; postId: number }[];
	likesCount: number;
	viewsCount: number;
	heartsCount: number;
	isLiked: boolean;
	isHearted: boolean;

	createdAt: string;
	orderBy: { createdAt: "asc" };
}

export interface PaginatedPosts {
	data: IPost[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface CreatePostPayload {
	title: string;
	content: string;
	topic?: string;
	tags?: string[];
	imageUrls?: string[];
	links?: { url: string }[];
}

export interface UpdatePostPayload {
	title?: string;
	content?: string;
	topic?: string;
	tags?: string[];
	imageUrls?: string[];
	links?: { url: string }[];
}

export interface PaginationParams {
	page?: number;
	limit?: number;
}
