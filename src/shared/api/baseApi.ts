import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { queryBaseHeaders } from "./headers";
import { API_URL } from "@shared/config/api.config";

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: queryBaseHeaders,
	}),
	tagTypes: ["User"],
	endpoints: () => ({}),
});
