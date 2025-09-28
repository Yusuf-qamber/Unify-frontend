const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/assignments`

// Get all assignments
const index = async () => {
  const token = localStorage.getItem("token")
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`)
  return res.json()
}

// Get a single assignment
const show = async (assignmentId) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/${assignmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch assignment: ${res.status}`)
  return res.json()
}

// Create
const create = async (formData) => {
  const token = localStorage.getItem("token")
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error(`Failed to create assignment: ${res.status}`)
  return res.json()
}

// Update
const update = async (assignmentId, formData) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/${assignmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error(`Failed to update assignment: ${res.status}`)
  return res.json()
}

// Delete
const remove = async (assignmentId) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/${assignmentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Failed to delete assignment: ${res.status}`)
  return res.json()
}

export { index, show, create, update, remove }
