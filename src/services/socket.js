import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"], 
});

export default socket;
