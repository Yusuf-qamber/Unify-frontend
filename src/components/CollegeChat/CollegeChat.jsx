import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import socket from "../../services/socket";
import * as chatService from "../../services/chatService";
import "./CollegeChat.scss";

const CollegeChat = ({ user }) => {
  const { college } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // Join college room + fetch history
  useEffect(() => {
    if (!user || !college) return;

    socket.emit("joinCollege", college);

    const fetchMessages = async () => {
      const data = await chatService.getCollegeMessages(college);
      setMessages(data);
    };

    fetchMessages();
  }, [user, college]);

  // Listen for new messages
  useEffect(() => {
    const handleMessage = (msg) => {
      if (msg.college === college) setMessages((prev) => [...prev, msg]);
    };
    socket.on("receiveCollegeMessage", handleMessage);
    return () => socket.off("receiveCollegeMessage", handleMessage);
  }, [college]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    socket.emit("sendCollegeMessage", {
      sender: user._id,
      college,
      content: text,
    });

    setText("");
  };

  return (
    <div className="college-chat-professional">
      <header>
        <h2>💬 {college.toUpperCase()} CHAT</h2>
      </header>

      <div className="chat-container">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender._id === user._id ? "me" : "other"}`}>
            <Link to={`/profile/${m.sender._id}`}>
              <img src={m.sender.picture || "/assets/default.png"} alt="avatar" className="avatar" />
            </Link>
            <div className="message-content">
              <div className="message-header">
                <Link to={`/profile/${m.sender._id}`}>
                  <span className="username">{m.sender.username}</span>
                </Link>
                <span className="time">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="text">{m.content}</div>
            </div>
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

export default CollegeChat;
