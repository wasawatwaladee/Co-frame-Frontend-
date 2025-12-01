import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://gui-bus-cartridges-incredible.trycloudflare.com";
export const socket = io(SERVER_URL);
