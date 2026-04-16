import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { queryBaseHeaders } from "./headers";

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:8001/api/",
		prepareHeaders: queryBaseHeaders,
	}),
	tagTypes: ["User"],
	endpoints: () => ({}),
});
//http://192.168.0.225:8001/api/