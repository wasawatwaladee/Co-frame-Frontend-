import { io } from "socket.io-client";
import { siteConfig } from "./constant/config";

export const socket = io(siteConfig.SERVER_URL);
