import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as noteService from "../../services/noteService";
import "./NoteForm.scss";

const NoteForm = (props) => {
  const navigate = useNavigate();

  const { college } = useParams();
const {noteId} = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
  });


  useEffect(() => {
    const fetchNote = async () => {
      const data = await noteService.showNote(college,noteId)
      setFormData(data)
    }
    if (noteId) fetchNote()
  }, [college,noteId])

	const handleChange = (evt) => {
		setFormData({ ...formData, [evt.target.name]: evt.target.value })
	}

const handleSubmit = async (evt) => {
  evt.preventDefault();

  if (noteId) {
    
    await props.handleUpdateNote(college, noteId, formData);
    navigate(`/${college}/notes/${noteId}`);
  } else {
    
    await noteService.createNote(formData, college);
    navigate(`/${college}/notes`);
  }
};


  return (
 <main className="note-form-container">
  <form onSubmit={handleSubmit}>
    <h1>{noteId ? 'Edit Note' : 'Add a Note'}</h1>
    <label htmlFor="title">Title</label>
    <input
      required
      type="text"
      name="title"
      id="title"
      value={formData.title}
      onChange={handleChange}
    />
    <label htmlFor="description">Description</label>
    <textarea
      required
      name="description"
      id="description"
      value={formData.description}
      onChange={handleChange}
    />
    <label htmlFor="file_url">File URL</label>
    <input
      required
      type="text"
      name="file_url"
      id="file_url"
      value={formData.file_url}
      onChange={handleChange}
    />
    <button type="submit">SUBMIT</button>
  </form>
</main>

  );
};

export default NoteForm;
