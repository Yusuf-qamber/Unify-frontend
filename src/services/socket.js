import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;

