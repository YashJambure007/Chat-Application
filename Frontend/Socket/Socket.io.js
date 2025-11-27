import { io } from "socket.io-client";
import { Baseurl } from "../services api/baseurl"; 

let socket = null;

// Initialize the socket connection
export const initSocket = (userId) => {
  if (!socket) {
    socket = io(Baseurl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    if (userId) {
      socket.emit("AddUserSocket", userId);
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      socket = null;
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.error("Socket not initialized. Call initSocket() first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket connection closed.");
    socket = null;
  }
};
