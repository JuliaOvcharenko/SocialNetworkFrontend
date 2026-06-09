import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@shared/config/api.config";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
	if (!socket) {
		throw new Error("Socket not initialized");
	}
	return socket;
};

export const initSocket = async (): Promise<Socket> => {
	if (socket) {
		return socket;
	}

	const token = await AsyncStorage.getItem("token");

	socket = io(BASE_URL, {
		auth: { token: `Bearer ${token}` },
		transports: ["websocket"],
		autoConnect: true,
		reconnection: true,
	});

	return socket;
};
export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
