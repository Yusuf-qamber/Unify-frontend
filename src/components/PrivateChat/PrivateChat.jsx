import { useState, useEffect, useRef } from "react";
import "./PrivateChat.scss";
import socket from "../../services/socket";
import * as chatService from "../../services/chatService";

const PrivateChat = ({ user, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await chatService.getPrivateMessages(selectedUser._id);
      setMessages(data);
    };
    fetchMessages();
  }, [selectedUser]);

  // Listen for new private messages
  useEffect(() => {
    socket.on("receivePrivateMessage", (msg) => {
      if (
        msg.sender._id === selectedUser._id ||
        msg.receiver === selectedUser._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receivePrivateMessage");
  }, [selectedUser]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    socket.emit("sendPrivateMessage", {
      sender: user._id,
      receiver: selectedUser._id,
      content: text,
    });
    setText("");
  };

  return (
    <div className="private-chat">
      <header>
        <img src={selectedUser.picture} alt="" className="avatar" />
        <h3>{selectedUser.username}</h3>
      </header>

      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.sender._id === user._id ? "me" : "other"}`}
          >
            <div className="text">{m.content}</div>
            <span className="time">
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default PrivateChat;