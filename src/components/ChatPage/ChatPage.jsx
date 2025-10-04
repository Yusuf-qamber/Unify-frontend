import { useState, useEffect, useCallback } from "react";
import "./ChatPage.scss";
import Sidebar from "../Sidebar/Sidebar";
import PrivateChat from "../PrivateChat/PrivateChat";
import * as chatService from "../../services/chatService";
import { confirm } from "material-ui-confirm";

const ChatPage = ({ user, socket, onlineUsers }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // fetch initial conversations
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

    // ✅ handle receiving messages live
    const handleReceive = (msg) => {
      const otherUser =
        msg.sender && msg.sender._id === user._id
          ? msg.receiver
          : msg.sender;
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

      if (selectedUser && selectedUser._id === otherUser._id) {
        setSelectedUser((prev) => ({ ...prev }));
      }
    };

    const handleNewConversation = (conv) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.user._id === conv.user._id);
        if (exists) return prev;
        return [conv, ...prev];
      });
    };

    const handleConversationDeleted = ({ userId }) => {
    setConversations((prev) => prev.filter((c) => c.user._id !== userId));
    if (selectedUser && selectedUser._id === userId) {
      setSelectedUser(null);
    }
  };

    socket.on("conversationDeleted", handleConversationDeleted);
    socket.on("receivePrivateMessage", handleReceive);
    socket.on("newConversation", handleNewConversation);

    return () => {
      socket.off("receivePrivateMessage", handleReceive);
      socket.off("newConversation", handleNewConversation);
      socket.off("conversationDeleted", handleConversationDeleted);
    };
  }, [socket, user, selectedUser]);


  const handleDeleteConversation = async (userId) => {
    try {
      const { confirmed } = await confirm({
        title: "Are You Sure?",
        description: <span style={{ fontWeight: 'bold' }}>This chat will be deleted permanently!</span>,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { style: { backgroundColor: '#e74c3c', color: '#fff' } },
        cancellationButtonProps: { style: { backgroundColor: '#ccc', color: '#333' } },
        dialogProps: { PaperProps: { style: { borderRadius: '1rem', padding: '1rem' } } },
      });

      if(!confirmed) return
      await chatService.deleteConversation(userId);
      
      setConversations((prev) =>
        prev.filter((c) => c.user._id !== userId)
      );
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
      socket.emit("deleteConversation", { userId: user._id, otherUserId: userId });
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        onSelectUser={(u) => setSelectedUser(u)}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        onDeleteConversation={handleDeleteConversation} 
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
