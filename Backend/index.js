import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import AuthRoutes from "./routes/Auth.js";
import DbCon from "./db/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import MessageRoutes from "./routes/Messages.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const app = express();

DbCon();

app.use(
  cors({
    origin: [
      "https://chat-application-4sjsk1625-yash-jambures-projects.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.use("/api/Auth", AuthRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/ai", aiRoutes);

if (NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "./Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./Frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-application-4sjsk1625-yash-jambures-projects.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true, 
});

let users = [];

const Addusers = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const ReomveUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const GetUser = (userId) => {
  return users.find((u) => u.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("AddUserSocket", (userId) => {
    Addusers(userId, socket.id);
    io.emit("getUsers", users);
    console.log("Connected users:", users);
  });

  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message } = data.messagedata;
    const receiver = GetUser(receiverId);

    if (receiver?.socketId) {
      io.to(receiver.socketId).emit("receiveMessage", {
        senderId,
        message,
      });
    } else {
      console.log("Receiver not connected");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    ReomveUser(socket.id);
    io.emit("getUsers", users);
    console.log("Remaining users:", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
