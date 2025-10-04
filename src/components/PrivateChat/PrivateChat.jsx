import { useState, useEffect, useRef } from "react";
import "./PrivateChat.scss";
import * as chatService from "../../services/chatService";
import { Link } from "react-router-dom";

const PrivateChat = ({ user, selectedUser, socket }) => {
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

  // handle incoming messages via socket
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleReceive = (msg) => {
      // Ensure this message belongs to the currently open chat
      const isRelevant =
        (msg.sender && msg.sender._id === selectedUser._id) ||
        (msg.receiver && msg.receiver === selectedUser._id) ||
        (msg.sender &&
          msg.sender._id === user._id &&
          msg.receiver === selectedUser._id);

      if (!isRelevant) return;

      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => {
          if (
            m.tempId &&
            msg.content === m.content &&
            msg.sender &&
            m.sender &&
            msg.sender._id === m.sender._id
          ) {
            // prefer replacing optimistic
            return true;
          }
          // fallback match content + sender + within 5s
          if (
            !m._id &&
            m.content === msg.content &&
            m.sender &&
            msg.sender &&
            m.sender._id === m.sender._id &&
            Math.abs(
              new Date(m.createdAt).getTime() -
                new Date(msg.createdAt).getTime()
            ) < 8000
          ) {
            return true;
          }
          return false;
        });

        if (existingIndex !== -1) {
          // replace that temp message with msg
          const copy = [...prev];
          copy[existingIndex] = msg;
          return copy;
        }

        // avoid duplicate if message id already present
        if (msg._id && prev.some((m) => m._id === msg._id)) return prev;

        return [...prev, msg];
      });
    };

    socket.on("receivePrivateMessage", handleReceive);
    return () => {
      socket.off("receivePrivateMessage", handleReceive);
    };
  }, [socket, selectedUser, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    // optimistic message (temporary)
    const temp = {
      tempId: Math.random().toString(36).slice(2, 9),
      sender: { _id: user._id },
      receiver: selectedUser._id,
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((p) => [...p, temp]);

    // emit via socket (server will save and emit back populated message)
    if (socket) {
      socket.emit("sendPrivateMessage", {
        sender: user._id,
        receiver: selectedUser._id,
        content: text,
      });
    } else {
      // fallback — POST using API (ensures persistence)
      try {
        const saved = await chatService.sendPrivateMessage(
          selectedUser._id,
          text
        );
        if (saved) {
          setMessages((p) => {
            // replace temp by saved if matches
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
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default PrivateChat;
