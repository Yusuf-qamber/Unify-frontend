import { useState } from "react";
import "./Sidebar.scss";
import * as chatService from "../../services/chatService";

const Sidebar = ({ conversations = [], onSelectUser, onlineUsers = {} }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.trim().length > 1) {
      try {
        const data = await chatService.searchUsers(val);
        setResults(data || []);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const displayList = search.trim() ? results : conversations;
  const isSearch = search.trim().length > 0;

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <input
          type="text"
          placeholder="🔍 Search user..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {isSearch && <p className="search-label">Search Results</p>}

      <div className="chat-list">
        {displayList.length === 0 && (
          <p className="no-results">
            No {isSearch ? "users found" : "conversations"}.
          </p>
        )}

        {displayList.map((item, idx) => {
          
          const u = item.user || item;
          const isOnline = !!onlineUsers?.[u._id];

          return (
            <div
              key={u._id || `search-${idx}`}
              className="chat-item"
              onClick={() => u._id && onSelectUser(u)}
            >
              <img
                src={u.picture || "/assets/default.png"}
                alt={u.username || "avatar"}
                className="avatar"
              />
              <div className="chat-info">
                <div className="username">
                  {u.username || "Unknown User"}
                  <span
                    className="online-dot"
                    style={{ background: isOnline ? "#31d158" : "#ccc" }}
                    title={isOnline ? "Online" : "Offline"}
                  />
                </div>
                {item.lastMessage ? (
                  <p className="last-message">{item.lastMessage}</p>
                ) : (
                  <p className="last-message muted">No messages yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
