import { io } from "socket.io-client";

export const socket = io(
 "https://quizsync-backend-gswt.onrender.com",
  {
    transports: ["websocket"],
  }
);