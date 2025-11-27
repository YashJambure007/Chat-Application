/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Baseurl } from "../../services api/baseurl";

export const Chat = ({ socket }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${Baseurl}/api/message/${user._id}/${selectedUser._id}`
      );
      setMessages(response.data.messages);
    } catch (err) {
      console.log("Error fetching messages", err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");

    try {
      const { data } = await axios.post(`${Baseurl}/api/message/send`, msgData);

      if (!selectedUser.isBot) {
        socket.emit("sendMessage", data.message);
      }

      if (selectedUser._id === "ai-bot") {
        const aiResponse = await axios.post(`${Baseurl}/api/ai/ask`, {
          message: msgData.message,
        });

        if (aiResponse.data && aiResponse.data.reply) {
          const botMessage = {
            senderId: "ai-bot",
            message: aiResponse.data.reply, 
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      }
    } catch (err) {
      console.error("Message send error", err);
    }
  };

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      if (data.senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket?.off("getMessage");
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-xl">
        Select a user to start chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-md shadow">
      {/* Chat Header */}
      <div className="flex items-center mb-0 border-b pb-2">
        <img
          src={selectedUser.profile}
          className="w-10 h-10 rounded-full mr-3"
          alt={selectedUser.name}
        />
        <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 bg-[url('https://w0.peakpx.com/wallpaper/744/548/HD-wallpaper-whatsapp-ma-doodle-pattern-thumbnail.jpg')]">
        {messages.map((msg, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`flex mb-2 ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.senderId === user._id
                  ? "chat-bubble bg-green-200 text-black"
                  : "chat-bubble bg-white text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-600 text-white rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};
