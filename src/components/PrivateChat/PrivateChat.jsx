import { useState, useEffect, useRef } from "react";
import "./PrivateChat.scss";
import * as chatService from "../../services/chatService";
import { Link } from "react-router-dom";

const PrivateChat = ({ user, selectedUser, socket,isMobileView,onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;
    let mounted = true;
    const fetchMessages = async () => {
      try {
        const data = await chatService.getPrivateMessages(selectedUser._id);
        if (mounted) setMessages(data || []);
      } catch (err) {
        console.error("Failed to load messages", err);
        if (mounted) setMessages([]);
      }
    };
    fetchMessages();
    return () => {
      mounted = false;
    };
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleReceive = (msg) => {
      const isRelevant =
        (msg.sender && msg.sender._id === selectedUser._id) ||
        (msg.receiver && msg.receiver === selectedUser._id) ||
        (msg.sender &&
          msg.sender._id === user._id &&
          msg.receiver === selectedUser._id);

      if (!isRelevant) return;

      setMessages((prev) => {
        if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receivePrivateMessage", handleReceive);
    return () => socket.off("receivePrivateMessage", handleReceive);
  }, [socket, selectedUser, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const temp = {
      tempId: Math.random().toString(36).slice(2, 9),
      sender: { _id: user._id },
      receiver: selectedUser._id,
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((p) => [...p, temp]);

    if (socket) {
      socket.emit("sendPrivateMessage", {
        sender: user._id,
        receiver: selectedUser._id,
        content: text,
      });
    } else {
      try {
        const saved = await chatService.sendPrivateMessage(
          selectedUser._id,
          text
        );
        if (saved) {
          setMessages((p) => {
            const idx = p.findIndex((m) => m.tempId === temp.tempId);
            if (idx !== -1) {
              const copy = [...p];
              copy[idx] = saved;
              return copy;
            }
            return [...p, saved];
          });
        }
      } catch (err) {
        console.error("Failed to save message via API", err);
      }
    }

    setText("");
  };

  return (
    <div className="private-chat">
      <header>
          {isMobileView && (
    <button
      className="back-btn"
      onClick={onBack}
      aria-label="Back to conversations"
    >
      ←
    </button>
  )}
        <Link to={`/profile/${selectedUser._id}`} className="chat-user-link">
          <img
            src={selectedUser.picture || "/assets/default.png"}
            alt={selectedUser.username}
            className="avatar"
          />
          <h3>{selectedUser.username}</h3>
        </Link>
      </header>

      <div className="messages">
        {messages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message ${m.sender?._id === user._id ? "me" : "other"}`}
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
        <div ref={chatEndRef} />
      </div>

      <div className="input-bar">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default PrivateChat;
