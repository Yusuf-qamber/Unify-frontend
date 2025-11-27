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

  // --- Added search + sort state ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

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

  // --- Derived array: filtered + sorted ---
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.owner?.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <p>Loading...</p>;

  return (
    <main className="note-list-container">
      <h1>{college === "it" ? college.toLocaleUpperCase() : college} Notes</h1>

      {props.user && (
        <li>
          <Link to={`/${college}/notes/new`}>Add a Note</Link>
        </li>
      )}

      {/* --- Added Search + Sort --- */}
      <div className="note-filter-bar">
        <input
          type="text"
          className="note-search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="note-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {!filteredNotes.length ? (
        <p>No notes found {college}</p>
      ) : (
        <ul>
          {filteredNotes.map((note) => (
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