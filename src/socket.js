import { io } from "socket.io-client";
import { siteConfig } from "./constant/config";
import useUserStore from "./stores/Store";

const user = useUserStore.getState().user;

export const socket = io(siteConfig.SERVER_URL, {
   auth: { username: user?.username || null}
});

