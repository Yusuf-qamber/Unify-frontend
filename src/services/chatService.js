const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/chat`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const getConversations = async () => {
  try {
    const res = await fetch(`${BASE_URL}/conversations`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  } catch (err) {
    console.error("chatService.getConversations error:", err);
    return [];
  }
};

export const getPrivateMessages = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/private/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
  } catch (err) {
    console.error("chatService.getPrivateMessages error:", err);
    return [];
  }
};

export const sendPrivateMessage = async (userId, content) => {
  try {
    const res = await fetch(`${BASE_URL}/private/${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (err) {
    console.error("chatService.sendPrivateMessage error:", err);
    return null;
  }
};

export const searchUsers = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to search users");
    const users = await res.json();
    
    return users.map((u) => ({ user: u, lastMessage: null, lastMessageAt: null }));
  } catch (err) {
    console.error("chatService.searchUsers error:", err);
    return [];
  }
};

export const deleteConversation = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/conversation/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete conversation");
    return await res.json();
  } catch (err) {
    console.error("chatService.deleteConversation error:", err);
    return null;
  }
};


export const getCollegeMessages = async (college) => {
  try {
    const res = await fetch(`${BASE_URL}/college/${college}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch college messages");
    return await res.json();
  } catch (err) {
    console.error("chatService.getCollegeMessages error:", err);
    return [];
  }
};

export const sendCollegeMessage = async (college, content) => {
  try {
    const res = await fetch(`${BASE_URL}/college/${college}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send college message");
    return await res.json();
  } catch (err) {
    console.error("chatService.sendCollegeMessage error:", err);
    return null;
  }
};