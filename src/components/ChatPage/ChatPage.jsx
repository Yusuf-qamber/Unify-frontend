import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./ChatPage.scss";
import Sidebar from "../Sidebar/Sidebar";
import PrivateChat from "../PrivateChat/PrivateChat";
import * as chatService from "../../services/chatService";
import { confirm } from "material-ui-confirm";

const ChatPage = ({ user, socket, onlineUsers }) => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Preselect user from Profile.jsx button
  useEffect(() => {
    if (location.state?.preselectedUser) {
      setSelectedUser(location.state.preselectedUser);
    }
  }, [location.state]);

  // Fetch conversations
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

  // Socket listeners
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (msg) => {
      const otherUser =
        msg.sender && msg.sender._id === user._id ? msg.receiver : msg.sender;
      if (!otherUser) return;

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.user._id !== otherUser._id);
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

    const handleConversationDeleted = ({ userId }) => {
      setConversations((prev) => prev.filter((c) => c.user._id !== userId));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
    };

    socket.on("receivePrivateMessage", handleReceive);
    socket.on("conversationDeleted", handleConversationDeleted);

    return () => {
      socket.off("receivePrivateMessage", handleReceive);
      socket.off("conversationDeleted", handleConversationDeleted);
    };
  }, [socket, user, selectedUser]);

  // Delete conversation
  const handleDeleteConversation = async (userId) => {
    try {
      const { confirmed } = await confirm({
        title: "Are You Sure?",
        description: <span style={{ fontWeight: "bold" }}>This chat will be deleted permanently!</span>,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { style: { backgroundColor: "#e74c3c", color: "#fff" } },
        cancellationButtonProps: { style: { backgroundColor: "#ccc", color: "#333" } },
        dialogProps: { PaperProps: { style: { borderRadius: "1rem", padding: "1rem" } } },
      });

      if (!confirmed) return;

      await chatService.deleteConversation(userId);
      setConversations((prev) => prev.filter((c) => c.user._id !== userId));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
      socket.emit("deleteConversation", { userId: user._id, otherUserId: userId });
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  return (
    <div className={`chat-page ${isMobileView ? "mobile" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${selectedUser && isMobileView ? "hidden" : ""}`}>
        <Sidebar
          conversations={conversations}
          onSelectUser={(u) => setSelectedUser(u)}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Private Chat */}
      <div className={`chat-wrapper ${!selectedUser && isMobileView ? "hidden" : ""}`}>
        {selectedUser ? (
          <PrivateChat
            user={user}
            selectedUser={selectedUser}
            socket={socket}
            onBack={() => setSelectedUser(null)}
            isMobileView={isMobileView}
          />
        ) : (
          !isMobileView && (
            <div className="empty-chat">
              <p>Select a user to start chatting 💬</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatPage;
