import { useState, useEffect } from "react";
import "./ChatPage.scss";
import Sidebar from "../Sidebar/Sidebar";
import PrivateChat from "../PrivateChat/PrivateChat";
import * as chatService from "../../services/chatService";

const ChatPage = ({ user, socket, onlineUsers }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        onSelectUser={setSelectedUser}
        onlineUsers={onlineUsers} 
      />
      {selectedUser ? (
        <PrivateChat user={user} selectedUser={selectedUser} socket={socket} />
      ) : (
        <div className="empty-chat">
          <p>Select a user to start chatting 💬</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
