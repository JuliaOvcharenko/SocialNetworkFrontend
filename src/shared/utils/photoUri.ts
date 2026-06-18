import { BASE_URL } from "@shared/config/api.config";

export function photoUri(url: string): string {
	if (!url) return "";
	if (url.includes("res.cloudinary.com")) return url;
	if (url.startsWith("http"))
		return url.replace(/^https?:\/\/[^/]+/, BASE_URL);
	const filename = url.split("/").pop();
	return `${BASE_URL}/media/shakal/${filename}`;
}
