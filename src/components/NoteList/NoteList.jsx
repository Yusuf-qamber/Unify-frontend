import { Link, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as noteService from "../../services/noteService.js";
import "./NoteList.scss";

const validColleges = [
  "it",
  "business",
  "science",
  "law",
  "engineering",
  "art",
];
const NoteList = (props) => {
  const { college } = useParams();
  if (!validColleges.includes(college)) {
    return <Navigate to="/" replace />;
  }

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await noteService.index(college);
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [college]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="note-list-container">
      <h1>{college === "it" ? college.toLocaleUpperCase() : college} Notes</h1>
      {props.user ? (
        <li>
          <Link to={`/${college}/notes/new`}>Add a Note</Link>
        </li>
      ) : (
        ""
      )}
      {!notes.length ? (
        <p>No notes found {college}</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id} className="note-card">
              <Link to={`/${college}/notes/${note._id}`}>
                <h2>{note.title}</h2>
                <span>
                  {note.owner?.username} <hr /> posted on{" "}
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default NoteList;
