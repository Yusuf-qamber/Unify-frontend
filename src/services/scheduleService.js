const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/schedule`

const getSchedule = async () => {
  const token = localStorage.getItem("token")
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Failed to fetch schedule: ${res.status}`)
  }
  return res.json()
}

const createCourse = async (course) => {
  const token = localStorage.getItem("token")
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(course)
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Failed to create course: ${res.status}`)
  }
  return res.json()
}

const updateCourse = async (course, courseId) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(course)
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Failed to update course: ${res.status}`)
  }
  return res.json()
}

const deleteCourse = async (courseId) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Failed to delete course: ${res.status}`)
  }
  return res.json()
}

export { getSchedule, createCourse, updateCourse, deleteCourse }
