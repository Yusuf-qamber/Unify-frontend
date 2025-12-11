const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/gpa`;

const index = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch GPA records: ${res.status}`);
  return res.json();
};

const show = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch GPA record: ${res.status}`);
  return res.json();
};

const create = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create GPA record: ${res.status}`);
  return res.json();
};

const update = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update GPA record: ${res.status}`);
  return res.json();
};

const remove = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete GPA record: ${res.status}`);
  return res.json();
};

export default { index, show, create, update, remove };
