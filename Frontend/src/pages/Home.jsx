import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SideBar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Baseurl } from "../../services api/baseurl";

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) return;

    const newSocket = io(Baseurl, {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 3, 
      timeout: 10000 
    });

    // Emit event after connection
    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("AddUserSocket", user._id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className="section bg-[url('https://w0.peakpx.com/wallpaper/744/548/HD-wallpaper-whatsapp-ma-doodle-pattern-thumbnail.jpg')] bg-gray-200 bg-center opacity-100">
      <div className="flex md:flex-row flex-col">
        <div className="basis-[25%] h-[100vh] md:bg-[#FFFFFF] bg-[#FFFFFF] overflow-y-auto">
          <SideBar socket={socket} />
        </div>
        <div className="basis-[75%] h-[100vh] overflow-y-auto">
          <Chat socket={socket} />
        </div>
      </div>
    </section>
  );
}
