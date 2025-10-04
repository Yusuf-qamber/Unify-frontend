const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/chat`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


const getConversations = async () => {
  try {
    const res = await fetch(`${BASE_URL}/conversations`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  } catch (err) {
    console.error("❌ getConversations error:", err);
    return [];
  }
};


const getPrivateMessages = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/private/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
  } catch (err) {
    console.error("❌ getPrivateMessages error:", err);
    return [];
  }
};


const sendPrivateMessage = async (userId, content) => {
  try {
    const res = await fetch(`${BASE_URL}/private/${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (err) {
    console.error("❌ sendPrivateMessage error:", err);
    return null;
  }
};


const searchUsers = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to search users");
    const users = await res.json();

    //  Wrap users so Sidebar can render them
    return users.map(u => ({
      user: u,       // this is key
      lastMessage: null,
      lastMessageAt: null
    }));
  } catch (err) {
    console.error("❌ searchUsers error:", err);
    return [];
  }
};

export{
  getConversations,
  getPrivateMessages,
  sendPrivateMessage,
  searchUsers
}