import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentForm from "../CommentForm/CommentForm.jsx";
import * as eventServics from "../../services/eventServics.js";
import MapBox from "../MapBox/MapBox.jsx";
import { FaTrash, FaPen } from "react-icons/fa";
import "./EventDetails.scss";

const EventDetails = (props) => {
  const navigate = useNavigate();
  const { college, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
        if (!eventId || eventId === "new"){
      setLoading(false);
      return;}
    const fetchEvent = async () => {
      try {
        const data = await eventServics.showEvent(college, eventId);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [college, eventId]);

  if (loading) return <p className="loading">Loading event...</p>;
  if (!event) return <Navigate to={`/${college}/events`} replace />;

  const handleAddComment = async (commentFormData) => {
    const newComment = await eventServics.createComment(
      college,
      eventId,
      commentFormData
    );
    setEvent({ ...event, comments: [...event.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await eventServics.deleteComment(college, eventId, commentId);
      setEvent({
        ...event,
        comments: event.comments.filter((c) => c._id !== commentId),
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
      const updatedComment = await eventServics.updateComment(
        college,
        eventId,
        commentId,
        { content: editContent }
      );

      setEvent({
        ...event,
        comments: event.comments.map((c) =>
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
    <main className="event-details">
      <div className="event-card">
        <h2 className="title">{event.title}</h2>

        <div className="meta">
          <span>
            By: <strong>{event.owner?.username || "Unknown"}</strong>
          </span>
          <span>Posted on: {new Date(event.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="description">{event.description}</p>
        <p className="location">📍 {event.location}</p>

        <div className="map-wrap">
          <MapBox
            coordinates={event.coordinates}
            onLocationChange={() => {}}
            readOnly={true}
          />
        </div>

        {event.owner?._id === props.user?._id && (
          <div className="actions">
            <Link to={`/${college}/events/${eventId}/edit`} className="btn edit">
              Edit
            </Link>
            <button
              onClick={() => props.handleDeleteEvent(college, eventId)}
              className="btn delete"
            >
              Delete
            </button>
          </div>
        )}


        <div className="back-link-wrapper">
          <Link to={`/${college}/events`} className="back-link-btn">
            Back to Events
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

        {!event.comments.length && (
          <p className="no-comments">There are no comments.</p>
        )}

        {event.comments.length > 0 && (
          <div className="comments-list">
            {event.comments.map((comment) => (
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

export default EventDetails;
