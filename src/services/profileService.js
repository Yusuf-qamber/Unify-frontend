const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch profile: ${res.status}`);
  }

  return res.json();
};

// UPDATE profile (username, picture) with FormData
const updateProfile = async (updates) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  if (updates.username) formData.append("username", updates.username);
  if (updates.picture instanceof File) {
    // when uploading a file
    formData.append("picture", updates.picture);
  } else if (typeof updates.picture === "string") {
    // if user still enters a direct URL (optional)
    formData.append("picture", updates.picture);
  }

  const res = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to update profile: ${res.status}`);
  }

  return res.json();
};

const deleteAccount = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete account: ${res.status}`);
  }

  return res.json();
};


const getUserProfile = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch user profile: ${res.status}`);
  }
  return res.json();
};

export { getProfile, getUserProfile, updateProfile, deleteAccount };

