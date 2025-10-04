import { useState, useEffect, useCallback } from "react";
import "./ChatPage.scss";
import Sidebar from "../Sidebar/Sidebar";
import PrivateChat from "../PrivateChat/PrivateChat";
import * as chatService from "../../services/chatService";

const ChatPage = ({ user, socket, onlineUsers }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);


  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (msg) => {
      // determine the other user for this conversation
      const otherUser = msg.sender && msg.sender._id === user._id ? msg.receiver : msg.sender;
      if (!otherUser) return;

      setConversations((prev) => {
        // remove existing entry for otherUser if present
        const filtered = prev.filter((c) => c.user._id !== otherUser._id);
        // prepend updated conversation
        return [
          {
            user: otherUser,
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt,
          },
          ...filtered,
        ];
      });


    };

    socket.on("receivePrivateMessage", handleReceive);

    return () => {
      socket.off("receivePrivateMessage", handleReceive);
    };
  }, [socket, user]);



  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        onSelectUser={(u) => setSelectedUser(u)}
        onlineUsers={onlineUsers}
      />
      {selectedUser ? (
        <PrivateChat
          user={user}
          selectedUser={selectedUser}
          socket={socket}
        />
      ) : (
        <div className="empty-chat">
          <p>Select a user to start chatting 💬</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
