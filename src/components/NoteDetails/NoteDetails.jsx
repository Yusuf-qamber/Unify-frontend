import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as noteService from "../../services/noteService.js";
import CommentForm from "../CommentForm/CommentForm.jsx";
import "./NoteDetails.scss";
import { FaTrash, FaPen } from "react-icons/fa";

const NoteDetails = (props) => {
  const navigate = useNavigate();
  const { college, noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!noteId || noteId === "new"){
      setLoading(false);
      return;}
    const fetchNote = async () => {
      try {
        const data = await noteService.showNote(college, noteId);
        setNote(data);
      } catch (err) {
        console.error(err);
        setNote(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [college, noteId]);

  if (loading) return <p>Loading note...</p>;
  if (!note) return <Navigate to={`/${college}/notes`} replace />;

  const handleAddComment = async (commentFormData) => {
    const newComment = await noteService.createComment(
      college,
      noteId,
      commentFormData
    );
    setNote({ ...note, comments: [...note.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await noteService.deleteComment(college, noteId, commentId);
      setNote({
        ...note,
        comments: note.comments.filter((c) => c._id !== commentId),
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const updatedComment = await noteService.updateComment(
        college,
        noteId,
        commentId,
        { content: editContent }
      );
      setNote({
        ...note,
        comments: note.comments.map((c) =>
          c._id === commentId ? updatedComment : c
        ),
      });
      setEditingCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  return (
    <main className="note-details-container">
      

      
      <div className="card note-card">
        <h1>{note.title}</h1>
        <p className="meta">
          By: {note.owner?.username || "Unknown"} | Posted on:{" "}
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <p className="description">{note.description}</p>

        {note.file_url && (
          <p className="file-link">
            <a href={note.file_url} target="_blank" rel="noreferrer">
              Open File
            </a>
          </p>
        )}

        {note.owner?._id === props.user?._id && (
          <div className="actions">
            <Link
              to={`/${college}/notes/${noteId}/edit`}
              className="btn edit"
            >
              Edit
            </Link>
            <button
              className="btn delete"
              onClick={() => props.handleDeleteNote(college, noteId)}
            >
              Delete
            </button>
            
          </div>
        )}
          <div className="back-link-wrapper">
    <Link to={`/${college}/notes`} className="back-link-btn">
      Back to Notes
    </Link>
  </div>
      </div>

     
      <section className="comments-section">
        <h3 className="section-title">Comments</h3>

        {props.user ? (
          <CommentForm handleAddComment={handleAddComment} user={props.user} />
        ) : (
          <p className="muted">You must be logged in to comment.</p>
        )}

        {!note.comments.length && (
          <p className="no-comments">There are no comments.</p>
        )}

        {note.comments.length > 0 && (
          <div className="comments-list">
            {note.comments.map((comment) => (
              <article key={comment._id} className="comment">
                <div className="author">
                  {comment.author?.username} {" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="edit-block">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleUpdateComment(comment._id)}
                        className="btn save"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="btn cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text">{comment.content}</p>
                )}

                {props.user && props.user._id === comment.author._id && (
                  <div className="row-actions">
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="icon-btn"
                      title="Edit"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="icon-btn danger"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default NoteDetails;
