const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`


const index = async (college) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${college}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const showNote = async (college, noteId) => {
  try {
    if (!noteId || noteId === "new") {
    throw new Error("Invalid note id");
  }
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${college}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}


const createNote = async (formData,college) => {
  try {
    const token = localStorage.getItem('token')
     const res = await fetch(`${BASE_URL}/${college}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}
const updateNote = async (formData, college, noteId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/${college}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
const deleteNote = async (noteId,college) => {
  try {
    const token = localStorage.getItem('token')
     const res = await fetch(`${BASE_URL}/${college}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}


const createComment = async (college, noteId, commentFormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${college}/notes/${noteId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentFormData),
  });
  const data = await res.json();
  return data;
};


const updateComment = async (college, noteId, commentId, commentFormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${BASE_URL}/${college}/notes/${noteId}/comments/${commentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    }
  );
  if (!res.ok) throw new Error("Failed to update comment");
  const data = await res.json();
  return data.comment;
};




const deleteComment = async (college, noteId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/${college}/notes/${noteId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};


export{
  index,
  showNote,
  createNote,
  updateNote,
  deleteNote,
  createComment,
  updateComment,
  deleteComment,
}