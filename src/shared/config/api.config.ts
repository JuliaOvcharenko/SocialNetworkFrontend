
// const IP_ADDRESS = '192.168.0.225';
const IP_ADDRESS = 'localhost';
const PORT = '8001';

export const BASE_URL = `http://${IP_ADDRESS}:${PORT}`;
console.log("Current API URL:", BASE_URL);
export const API_URL = `${BASE_URL}/api`;